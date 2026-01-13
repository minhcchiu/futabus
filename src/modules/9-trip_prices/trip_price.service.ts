import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { TripPrice, TripPriceDocument } from "./schemas/trip_price.schema";

@Injectable()
export class TripPriceService extends BaseService<TripPriceDocument> {
  constructor(@InjectModel(TripPrice.name) model: Model<TripPriceDocument>) {
    super(model);
  }
}
