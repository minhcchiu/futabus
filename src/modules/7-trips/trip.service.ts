import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
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
    private readonly tripStopService: TripStopService,
  ) {
    super(model);
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
}
