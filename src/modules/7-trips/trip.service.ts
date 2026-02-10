import { forwardRef, Inject, Injectable } from "@nestjs/common";
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
import { Trip, TripDocument } from "./schemas/trip.schema";
@Injectable()
export class TripService extends BaseService<TripDocument> {
  constructor(
    @InjectModel(Trip.name) model: Model<TripDocument>,
    private readonly tripPriceService: TripPriceService,
    @Inject(forwardRef(() => TripStopService))
    private readonly tripStopService: TripStopService,
    private readonly bookingService: BookingService,
    private readonly seatService: SeatService,
  ) {
    super(model);
  }

  async getLocationsFromTo() {
    const locations = await this.tripStopService.aggregate([
      // Bước 1: Lookup StopLocation cho startStop để lấy provinceId
      {
        $lookup: {
          from: "stop_locations",
          localField: "startStopId",
          foreignField: "_id",
          as: "startStop",
        },
      },
      { $unwind: "$startStop" }, // Unwind để truy cập provinceId
      // Bước 2: Lookup StopLocation cho endStop để lấy provinceId
      {
        $lookup: {
          from: "stop_locations",
          localField: "endStopId",
          foreignField: "_id",
          as: "endStop",
        },
      },
      { $unwind: "$endStop" }, // Unwind để truy cập provinceId
      // Bước 3: Group theo provinceFrom (startStop.provinceId), tích lũy unique provincesTo (endStop.provinceId)
      {
        $group: {
          _id: "$startStop.provinceId",
          provincesToIds: { $addToSet: "$endStop.provinceId" },
        },
      },
      // Bước 4: Lookup thông tin provinceFrom từ Province
      {
        $lookup: {
          from: "provinces", // Tên collection của Province
          localField: "_id",
          foreignField: "_id",
          as: "provinceFrom",
        },
      },
      { $unwind: "$provinceFrom" }, // Unwind để biến thành object
      // Bước 5: Lookup provinces cho provincesTo với pipeline
      {
        $lookup: {
          from: "provinces",
          let: { toIds: "$provincesToIds" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$toIds"] },
              },
            },
          ],
          as: "provincesTo",
        },
      },
      // Bước 7: Sort tùy chọn (ví dụ: theo provinceFrom.name)
      { $sort: { "provinceFrom.nameEn": 1 } },
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
}
