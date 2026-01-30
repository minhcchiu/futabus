import { PartialType } from "@nestjs/mapped-types";
import { IsOptional } from "class-validator";
import { ObjectId } from "mongodb";
import { ToObjectId } from "~common/validators/objectId";
import { CreateTripPriceDto } from "./create-trip_price.dto";
export class UpdateTripPriceDto extends PartialType(CreateTripPriceDto) {
  @IsOptional()
  @ToObjectId()
  _id?: ObjectId;
}
