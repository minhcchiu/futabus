import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { TripService } from "~modules/7-trips/trip.service";
import { CreateTripStopDto } from "~modules/8-trip_stop/dto/create-trip_stop.dto";
import { UpdateTripStopDto } from "~modules/8-trip_stop/dto/update-trip_stop.dto";
import { TripStop, TripStopDocument } from "./schemas/trip_stop.schema";

@Injectable()
export class TripStopService extends BaseService<TripStopDocument> {
  private tripStopService: TripStopService;
  constructor(
    @InjectModel(TripStop.name) model: Model<TripStopDocument>,
    @Inject(forwardRef(() => TripService))
    private readonly tripService: TripService,
  ) {
    super(model);

    this.tripStopService = this;
  }

  async createTripStop(input: CreateTripStopDto) {
    const tripStopCreated = await this.tripStopService.create(input);

    this.tripStopService
      .findById(tripStopCreated._id, {
        populate: "stopId",
      })
      .then((tripStop: any) => {
        const provinceId = tripStop.stopId.provinceId;
        if (provinceId) {
          const $addToSet = {};
          if (tripStop.departureTime) {
            Object.assign($addToSet, {
              departureProvinceIds: provinceId,
            });
          }
          if (tripStop.arrivalTime) {
            Object.assign($addToSet, {
              arrivalProvinceIds: provinceId,
            });
          }
          this.tripService.updateById(input.tripId, {
            $addToSet,
          });
        }
      });

    return tripStopCreated;
  }

  async updateTripStop(id: ObjectId, input: UpdateTripStopDto) {
    const tripStopUpdated = await this.tripStopService.updateById(id, input);

    const tripStops = await this.tripStopService.findMany(
      {
        tripId: tripStopUpdated.tripId,
      },
      {
        populate: "stopId",
      },
    );

    const departureProvinceIds = tripStops
      .filter((tripStop: any) => tripStop.departureTime)
      .map((tripStop: any) => tripStop.stopId.provinceId);
    const arrivalProvinceIds = tripStops
      .filter((tripStop: any) => tripStop.arrivalTime)
      .map((tripStop: any) => tripStop.stopId.provinceId);

    this.tripService.updateById(tripStopUpdated.tripId, {
      departureProvinceIds,
      arrivalProvinceIds,
    });

    return tripStopUpdated;
  }
}
