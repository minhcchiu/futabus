import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Route, RouteDocument } from "./schemas/route.schema";

@Injectable()
export class RouteService extends BaseService<RouteDocument> {
  constructor(@InjectModel(Route.name) model: Model<RouteDocument>) {
    super(model);
  }
}
