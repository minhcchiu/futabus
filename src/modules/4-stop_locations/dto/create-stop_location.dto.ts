import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { ObjectId } from "mongodb";
import { LocationDto } from "~common/dto/location.dto";
import { IsObjectId } from "~common/validators/objectId";

export class CreateStopLocationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsObjectId()
  provinceId: ObjectId;

  @IsOptional()
  @IsObjectId()
  districtId?: ObjectId;

  @IsOptional()
  @IsObjectId()
  wardId?: ObjectId;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}
