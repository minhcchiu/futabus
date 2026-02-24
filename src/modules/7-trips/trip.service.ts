import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { BookingService } from "~modules/10-bookings/booking.service";
import { SeatService } from "~modules/3-seats/seat.service";
import { TripStopDocument } from "~modules/8-trip_stop/schemas/trip_stop.schema";
import { TripStopService } from "~modules/8-trip_stop/trip_stop.service";
import { TripPriceDocument } from "~modules/9-trip_prices/schemas/trip_price.schema";
import { TripPriceService } from "~modules/9-trip_prices/trip_price.service";
import { arrayToMap } from "~utils/common.util";
import { CopyTripToDatesDto } from "./dto/copy-trip-to-dates.dto";
import { Trip, TripDocument } from "./schemas/trip.schema";
@Injectable()
export class TripService extends BaseService<TripDocument> {
  private readonly tripService: TripService;
  constructor(
    @InjectModel(Trip.name) model: Model<TripDocument>,
    private readonly tripPriceService: TripPriceService,
    @Inject(forwardRef(() => TripStopService))
    private readonly tripStopService: TripStopService,
    private readonly bookingService: BookingService,
    private readonly seatService: SeatService,
  ) {
    super(model);
    this.tripService = this;
  }

  async getLocationsFromTo() {
    const locations = await this.tripService.aggregate([
      // {
      //   $match: {
      //     arrivalTime: { $gt: Date.now() },
      //   },
      // },
      // Bước 1: Lookup StopLocation cho startStop để lấy provinceId
      { $unwind: "$departureProvinceIds" },

      // Gom các mảng arrival lại
      {
        $group: {
          _id: "$departureProvinceIds",
          arrivalProvinceIds: { $push: "$arrivalProvinceIds" },
        },
      },

      // Flatten + remove duplicate
      {
        $project: {
          arrivalProvinceIds: {
            $reduce: {
              input: "$arrivalProvinceIds",
              initialValue: [],
              in: { $setUnion: ["$$value", "$$this"] },
            },
          },
        },
      },

      // Populate departureProvince
      {
        $lookup: {
          from: "provinces",
          localField: "_id",
          foreignField: "_id",
          as: "departureProvince",
        },
      },
      { $unwind: "$departureProvince" },

      // Populate arrivalProvinceIds
      {
        $lookup: {
          from: "provinces",
          localField: "arrivalProvinceIds",
          foreignField: "_id",
          as: "arrivalProvinces",
        },
      },

      {
        $project: {
          _id: 0,
          provinceFrom: "$departureProvince",
          provincesTo: "$arrivalProvinces",
        },
      },
    ]);

    return locations;
  }

  async assignTripPrices(trips: TripDocument[]) {
    const tripPrices: TripPriceDocument[] = await this.tripPriceService.findMany({
      tripId: { $in: trips.map(v => v._id) },
    });

    const tripPriceMap = arrayToMap(tripPrices, tripPrice => tripPrice.tripId.toString());

    trips.forEach(trip => {
      Object.assign(trip, { tripPrices: tripPriceMap.get(trip._id.toString()) || [] });
    });
    return trips;
  }

  async assignTripStops(trips: TripDocument[]) {
    const tripStops: TripStopDocument[] = await this.tripStopService.findMany(
      {
        tripId: { $in: trips.map(v => v._id) },
      },
      {
        populate: "stopId",
      },
    );

    const tripStopsMap = arrayToMap(tripStops, tripStop => tripStop.tripId.toString());

    trips.forEach(trip => {
      Object.assign(trip, { tripStops: tripStopsMap.get(trip._id.toString()) || [] });
    });
    return trips;
  }

  async assignEmptySeatCount(trips: TripDocument[]) {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    const [seatsBookedMap, totalSeats]: [
      Map<string, ObjectId[]>,
      { _id: string; count: number }[],
    ] = await Promise.all([
      this.bookingService.getSeatsBookedByTripIds(trips.map(v => v._id)),
      this.seatService.aggregate([
        {
          $match: {
            // @ts-ignore
            vehicleId: { $in: trips.map(trip => trip.vehicleId?._id || trip.vehicleId) },
          },
        },
        {
          $group: {
            _id: "$vehicleId",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const seatsMap = arrayToMap(totalSeats, seat => seat._id.toString());

    trips.forEach(trip => {
      const bookedSeats = seatsBookedMap.get(trip._id.toString()) || [];
      const totalSeats =
        // @ts-ignore
        seatsMap.get(trip.vehicleId?._id?.toString() || trip.vehicleId?.toString());

      // @ts-ignore
      trip.emptySeat = (totalSeats[0]?.count || 0) - bookedSeats.length;
    });

    return trips;
  }
  /* eslint-enable @typescript-eslint/ban-ts-comment */

  async createTripsFromBaseTrip({ tripId, dates }: CopyTripToDatesDto) {
    // Get the base trip to copy
    const baseTrip = await this.tripService.findById(tripId);
    if (!baseTrip) {
      throw new BadRequestException("Base trip not found");
    }

    // Get base trip stops and prices
    const [baseTripStops, baseTripPrices] = await Promise.all([
      this.tripStopService.findMany({ tripId }),
      this.tripPriceService.findMany({ tripId }),
    ]);

    // Calculate time difference for each date
    const baseDepartureTime = baseTrip.departureTime;
    const baseDate = new Date(baseDepartureTime).setHours(0, 0, 0, 0);

    const tripsWithTimeDiff = dates.map(date => {
      const targetDate = new Date(date).setHours(0, 0, 0, 0);
      const timeDifference = targetDate - baseDate;

      return {
        tripData: {
          companyId: baseTrip.companyId,
          routeId: baseTrip.routeId,
          vehicleId: baseTrip.vehicleId,
          driverPhone: baseTrip.driverPhone,
          departureTime: baseTrip.departureTime + timeDifference,
          arrivalTime: baseTrip.arrivalTime + timeDifference,
          price: baseTrip.price,
          status: baseTrip.status,
          departureProvinceIds: baseTrip.departureProvinceIds,
          arrivalProvinceIds: baseTrip.arrivalProvinceIds,
        },
        timeDifference,
      };
    });

    const trips = tripsWithTimeDiff.map(item => item.tripData);

    // Create the new trips
    const createdTrips = await this.createMany(trips);

    // Copy trip stops for each new trip
    const tripStopsToCreate = [];
    const tripPricesToCreate = [];

    createdTrips.forEach((newTrip, index) => {
      const timeDifference = tripsWithTimeDiff[index].timeDifference;

      // Copy trip stops with adjusted times
      baseTripStops.forEach(baseStop => {
        tripStopsToCreate.push({
          tripId: newTrip._id,
          stopId: baseStop.stopId,
          arrivalTime: baseStop.arrivalTime ? baseStop.arrivalTime + timeDifference : undefined,
          departureTime: baseStop.departureTime
            ? baseStop.departureTime + timeDifference
            : undefined,
        });
      });

      // Copy trip prices
      baseTripPrices.forEach(basePrice => {
        tripPricesToCreate.push({
          tripId: newTrip._id,
          fromStopId: basePrice.fromStopId,
          toStopId: basePrice.toStopId,
          price: basePrice.price,
          seatId: basePrice.seatId,
        });
      });
    });

    // Create all trip stops and prices
    await Promise.all([
      this.tripStopService.createMany(tripStopsToCreate),
      this.tripPriceService.createMany(tripPricesToCreate),
    ]);

    return createdTrips;
  }
}
