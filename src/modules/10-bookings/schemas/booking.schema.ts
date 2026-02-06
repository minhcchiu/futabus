import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { CustomerInfoDto, PaymentInfoDto } from "~modules/10-bookings/dto/create-booking.dto";
import { BookingStatus } from "~modules/10-bookings/enums/booking-status.enum";
import { PaymentStatus } from "~modules/10-bookings/enums/payment-status.enum";
import { Seat } from "~modules/3-seats/schemas/seat.schema";
import { Trip } from "~modules/7-trips/schemas/trip.schema";
import { TripStop } from "~modules/8-trip_stop/schemas/trip_stop.schema";
import { SepayTransferNotify } from "~modules/pre-built/15-sepay/dto/create-sepay.dto";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "bookings",
})
export class Booking {
  @Prop({ type: String, index: true })
  code: string;

  @Prop({ type: Number })
  sttBooking: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: Trip.name, required: true })
  tripId: ObjectId;

  @Prop([{ type: SchemaTypes.ObjectId, ref: Seat.name, required: true }])
  seatIds: ObjectId[];

  @Prop({ type: SchemaTypes.ObjectId, ref: TripStop.name })
  fromStopId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: TripStop.name })
  toStopId: ObjectId;

  @Prop({ type: String })
  pickupCustomAddress: string;

  @Prop({ type: String })
  dropoffCustomAddress: string;

  @Prop({ type: Number })
  departureTime: number;

  @Prop({ type: String, enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus = BookingStatus.PENDING;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: Number, default: () => Date.now() + 5 * 60 * 1000 }) // 5minutes
  expireAt: number;

  @Prop({
    type: {
      method: { type: String },
      status: { type: String, enum: PaymentStatus, default: PaymentStatus.UNPAID },
      amount: { type: Number }, // Số tiền phải trả
      paidAmount: { type: Number }, // Số tiền đã trả
      transactionId: { type: String }, // Mã giao dịch từ cổng
      provider: { type: String }, // momo | vnpay | zalopay
      paidAt: { type: Number },
      refundAmount: { type: Number },
      refundedAt: { type: Number },
      note: { type: String }, // ghi chú quầy
      image: { type: String },
    },
  })
  paymentInfo: PaymentInfoDto;

  @Prop({
    type: [
      {
        gateway: String, // TPBank
        transactionDate: String, // "2026-02-04 08:43:55"
        accountNumber: String, // "00002709360"
        code: String, // ML2602040
        content: String, // ML2602040
        transferAmount: Number, // 5000
        referenceCode: String, // 373ITC1260350663
        accumulated: Number, // 190882
        sepayId: Number, // 41111631
        createdAt: Number,
      },
    ],
  })
  sepayHistories: SepayTransferNotify[];

  @Prop({
    type: {
      name: { type: String },
      phone: { type: String },
      email: { type: String },
      note: { type: String },
    },
  })
  customerInfo: CustomerInfoDto;
}

export type BookingDocument = Booking & HydratedDocument<Booking>;
export const BookingSchema = SchemaFactory.createForClass(Booking);
