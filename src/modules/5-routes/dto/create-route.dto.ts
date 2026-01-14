import { IsNotEmpty } from "class-validator";
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
}
