import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Seat, SeatDocument } from "./schemas/seat.schema";

@Injectable()
export class SeatService extends BaseService<SeatDocument> {
  constructor(@InjectModel(Seat.name) model: Model<SeatDocument>) {
    super(model);
  }
}
