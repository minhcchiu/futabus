import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { Route, RouteDocument } from "./schemas/route.schema";

@Injectable()
export class RouteService extends BaseService<RouteDocument> {
  private readonly routeService: RouteService;
  constructor(@InjectModel(Route.name) model: Model<RouteDocument>) {
    super(model);

    this.routeService = this;
  }

  async getLocationsFromTo() {
    const locations = await this.routeService.aggregate([
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
}
