import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateRouteDto {
  @IsNotEmpty()
  @IsObjectId()
  companyId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  startStopId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  endStopId: ObjectId;

  @IsOptional()
  @IsNumber()
  durationHour?: number;
}
