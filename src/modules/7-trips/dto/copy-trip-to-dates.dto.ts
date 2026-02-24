import { IsArray, IsNotEmpty } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CopyTripToDatesDto {
  @IsNotEmpty()
  @IsObjectId()
  tripId: ObjectId;

  @IsArray()
  @IsNotEmpty({ each: true })
  dates: number[];
}
