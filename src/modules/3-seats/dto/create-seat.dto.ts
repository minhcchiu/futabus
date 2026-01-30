import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";

export class CreateSeatDto {
  @IsOptional()
  @IsObjectId()
  _id?: ObjectId;

  @IsObjectId()
  @IsNotEmpty()
  vehicleId: ObjectId;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  floor: number;

  @IsNumber()
  @IsNotEmpty()
  row: number;

  @IsNumber()
  @IsNotEmpty()
  column: number;

  @IsBoolean()
  @IsOptional()
  isVip: boolean;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
