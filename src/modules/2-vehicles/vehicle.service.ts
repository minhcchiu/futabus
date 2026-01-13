import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Vehicle, VehicleDocument } from "./schemas/vehicle.schema";

@Injectable()
export class VehicleService extends BaseService<VehicleDocument> {
  constructor(@InjectModel(Vehicle.name) model: Model<VehicleDocument>) {
    super(model);
  }
}
