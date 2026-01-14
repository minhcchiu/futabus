import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";
import { BusCompanyStatusEnum } from "~modules/1-bus_companies/enums/bus-company-status.enum";

export class CreateBusCompanyDto {
  @IsOptional()
  @IsObjectId()
  userId: ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  hotline: string;

  @IsOptional()
  @IsString({ each: true })
  hotlineList?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  policy?: string;

  @IsOptional()
  @IsString()
  status?: BusCompanyStatusEnum;
}
