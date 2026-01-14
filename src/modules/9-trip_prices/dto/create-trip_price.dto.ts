import { IsNotEmpty, IsNumber } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateTripPriceDto {
  @IsNotEmpty()
  @IsObjectId()
  tripId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  fromStopId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  toStopId: ObjectId;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
