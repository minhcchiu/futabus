import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateTripPriceDto {
  @IsNotEmpty()
  @IsObjectId()
  tripId: ObjectId;

  @IsOptional()
  @IsObjectId()
  fromStopId?: ObjectId;

  @IsOptional()
  @IsObjectId()
  toStopId?: ObjectId;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsObjectId()
  seatId: ObjectId;
}
