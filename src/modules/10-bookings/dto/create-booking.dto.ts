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
import { PaymentStatus } from "../enums/payment-status.enum";

export class PaymentInfoDto {
  @IsOptional()
  @IsNotEmpty()
  method: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsOptional()
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

  @IsOptional()
  @IsString()
  image?: string;
}

export class CustomerInfoDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  note?: string;
}
export class CreateBookingDto {
  @IsNotEmpty()
  @IsObjectId()
  tripId: ObjectId;

  @IsNotEmpty()
  @IsObjectId({ each: true })
  seatIds: ObjectId[];

  @IsOptional()
  @IsObjectId()
  fromStopId?: ObjectId;

  @IsOptional()
  @IsObjectId()
  toStopId?: ObjectId;

  @IsOptional()
  @IsString()
  pickupCustomAddress?: string;

  @IsOptional()
  @IsString()
  dropoffCustomAddress?: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  expireAt?: number;

  @IsOptional()
  @IsNumber()
  departureTime?: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaymentInfoDto)
  paymentInfo: PaymentInfoDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CustomerInfoDto)
  customerInfo: CustomerInfoDto;

  code?: string;
  sttBooking?: number;
}
