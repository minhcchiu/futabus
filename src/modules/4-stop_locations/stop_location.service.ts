import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { StopLocation, StopLocationDocument } from "./schemas/stop_location.schema";

@Injectable()
export class StopLocationService extends BaseService<StopLocationDocument> {
  constructor(@InjectModel(StopLocation.name) model: Model<StopLocationDocument>) {
    super(model);
  }
}
