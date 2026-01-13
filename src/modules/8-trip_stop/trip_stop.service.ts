import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { TripStop, TripStopDocument } from "./schemas/trip_stop.schema";

@Injectable()
export class TripStopService extends BaseService<TripStopDocument> {
  constructor(@InjectModel(TripStop.name) model: Model<TripStopDocument>) {
    super(model);
  }
}
