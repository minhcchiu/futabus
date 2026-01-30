import { IsArray, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";
import { VehicleLevelEnum } from "~modules/2-vehicles/enums/vehicle-level.enum";
import { VehicleStatusEnum } from "~modules/2-vehicles/enums/vehicle-status.enum";

export class CreateVehicleDto {
  @IsObjectId()
  @IsNotEmpty()
  companyId: ObjectId;

  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @IsEnum(VehicleLevelEnum)
  level?: VehicleLevelEnum;

  @IsEnum(VehicleStatusEnum)
  status?: VehicleStatusEnum;

  @IsArray()
  @IsString({ each: true })
  amenities?: string[];
}
