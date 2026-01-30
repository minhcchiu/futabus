import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";
import { TripStatus } from "../enums/trip-status.enum";

export class CreateTripDto {
  @IsNotEmpty()
  @IsObjectId()
  companyId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  routeId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  vehicleId: ObjectId;

  @IsOptional()
  @IsNumber()
  departureTime: number;

  @IsOptional()
  @IsNumber()
  arrivalTime: number;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsEnum(TripStatus)
  status?: TripStatus;
}
