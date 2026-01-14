import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateSeatDto {
  @IsObjectId()
  @IsNotEmpty()
  vehicleId: ObjectId;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsNotEmpty()
  floor: number;

  @IsString()
  @IsNotEmpty()
  row: string;

  @IsString()
  @IsNotEmpty()
  column: string;
}
