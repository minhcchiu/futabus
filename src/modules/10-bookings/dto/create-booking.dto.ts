import { Type } from "class-transformer";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { ObjectId } from "mongodb";
import { IsObjectId } from "~common/validators/objectId";
import { BookingStatus } from "~modules/10-bookings/enums/booking-status.enum";
import { PaymentMethod } from "../enums/payment-method.enum";
import { PaymentStatus } from "../enums/payment-status.enum";

export class PaymentInfoDto {
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  paidAmount?: number;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsNumber()
  paidAt?: number;

  @IsOptional()
  @IsNumber()
  refundAmount?: number;

  @IsOptional()
  @IsNumber()
  refundedAt?: number;

  @IsOptional()
  @IsString()
  note?: string;
}
export class CreateBookingDto {
  @IsNotEmpty()
  @IsObjectId()
  tripId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  seatId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  fromStopId: ObjectId;

  @IsNotEmpty()
  @IsObjectId()
  toStopId: ObjectId;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaymentInfoDto)
  paymentInfo: PaymentInfoDto;
}
