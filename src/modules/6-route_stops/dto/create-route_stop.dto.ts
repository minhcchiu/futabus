import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateRouteStopDto {
  @IsNotEmpty()
  @IsObjectId()
  routeId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  stopLocationId: ObjectId;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsNotEmpty()
  @IsBoolean()
  isPickup: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isDropOff: boolean;

  @IsOptional()
  @IsNumber()
  distanceFromStart?: number;
}
