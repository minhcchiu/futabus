import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { PaymentInfoDto } from "~modules/10-bookings/dto/create-booking.dto";
import { BookingStatus } from "~modules/10-bookings/enums/booking-status.enum";
import { PaymentMethod } from "~modules/10-bookings/enums/payment-method.enum";
import { PaymentStatus } from "~modules/10-bookings/enums/payment-status.enum";
import { Seat } from "~modules/3-seats/schemas/seat.schema";
import { StopLocation } from "~modules/4-stop_locations/schemas/stop_location.schema";
import { Trip } from "~modules/7-trips/schemas/trip.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "bookings",
})
export class Booking {
  @Prop({ type: SchemaTypes.ObjectId, ref: Trip.name, required: true })
  tripId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Seat.name, required: true })
  seatId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: StopLocation.name, required: true })
  fromStopId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: StopLocation.name, required: true })
  toStopId: ObjectId;

  @Prop({ type: String, enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus = BookingStatus.PENDING;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({
    type: {
      method: { type: String, enum: PaymentMethod },
      status: { type: String, enum: PaymentStatus, default: PaymentStatus.UNPAID },
      amount: { type: Number }, // Số tiền phải trả
      paidAmount: { type: Number }, // Số tiền đã trả
      transactionId: { type: String }, // Mã giao dịch từ cổng
      provider: { type: String }, // momo | vnpay | zalopay
      paidAt: { type: Date },
      refundAmount: { type: Number },
      refundedAt: { type: Date },
      note: { type: String }, // ghi chú quầy
    },
  })
  paymentInfo: PaymentInfoDto;
}

export type BookingDocument = Booking & HydratedDocument<Booking>;
export const BookingSchema = SchemaFactory.createForClass(Booking);
