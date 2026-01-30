import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateTripStopDto {
  @IsNotEmpty()
  @IsObjectId()
  tripId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  stopId: ObjectId;

  @IsOptional()
  @IsNumber()
  arrivalTime?: number;

  @IsOptional()
  @IsNumber()
  departureTime?: number;
}
