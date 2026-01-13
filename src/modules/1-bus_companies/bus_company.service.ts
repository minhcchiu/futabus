import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { BusCompany, BusCompanyDocument } from "./schemas/bus_company.schema";

@Injectable()
export class BusCompanyService extends BaseService<BusCompanyDocument> {
  constructor(@InjectModel(BusCompany.name) model: Model<BusCompanyDocument>) {
    super(model);
  }
}
