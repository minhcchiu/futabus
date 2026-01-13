import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { RouteStop, RouteStopDocument } from "./schemas/route_stop.schema";

@Injectable()
export class RouteStopService extends BaseService<RouteStopDocument> {
  constructor(@InjectModel(RouteStop.name) model: Model<RouteStopDocument>) {
    super(model);
  }
}
