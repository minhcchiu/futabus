import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { UpdateBookingDto } from "~modules/10-bookings/dto/update-booking.dto";
import { BookingStatus } from "~modules/10-bookings/enums/booking-status.enum";
import { PaymentMethod } from "~modules/10-bookings/enums/payment-method.enum";
import { PaymentStatus } from "~modules/10-bookings/enums/payment-status.enum";
import { setCurrentBooking } from "~modules/10-bookings/helpers/booking-code";
import { SettingService } from "~modules/pre-built/11-settings/setting.service";
import { SepayTransferNotify } from "~modules/pre-built/15-sepay/dto/create-sepay.dto";
import { MailService } from "~shared/mail/mail.service";
import { Booking, BookingDocument } from "./schemas/booking.schema";

@Injectable()
export class BookingService extends BaseService<BookingDocument> {
  private readonly bookingService: BookingService;
  constructor(
    @InjectModel(Booking.name) model: Model<BookingDocument>,
    private readonly mailService: MailService,
    private readonly settingService: SettingService,
  ) {
    super(model);
    this.bookingService = this;
  }

  async holdSlot(id: ObjectId, body: UpdateBookingDto) {
    const booking: BookingDocument = await this.bookingService.findById(id);
    if (!booking) throw new BadRequestException(`Booking not found`);

    if (booking.status !== BookingStatus.PENDING) return;

    return this.bookingService.updateById(id, {
      status: BookingStatus.PENDING,
      expireAt:
        body.paymentInfo?.method === PaymentMethod.CASH
          ? Date.now() + 1 * 60 * 60 * 1000 // 1hours
          : Date.now() + 5 * 60 * 1000, // 5minutes
      "paymentInfo.method": body.paymentInfo?.method,
    });
  }

  async setSttCurrentBooking() {
    const latestBooking = await this.bookingService.findOne(
      {},
      {
        sort: { sttBooking: -1 },
      },
    );

    setCurrentBooking(latestBooking?.sttBooking || 0);
  }

  async updateBookingStatus(id: ObjectId, body: UpdateBookingDto) {
    if (body.paymentInfo) {
      Object.keys(body.paymentInfo).forEach(key => {
        (body as any)[`paymentInfo.${key}`] = (body.paymentInfo as any)[key];
      });

      delete body.paymentInfo;
    }

    if (
      body.status === BookingStatus.CONFIRMED &&
      body?.paymentInfo?.method === PaymentMethod.CASH
    ) {
      body.expireAt = Date.now() + 1 * 60 * 60 * 1000;
    }

    const booking = await this.bookingService.updateById(id, body, {
      new: true,
      populate: [
        {
          path: "tripId",
          populate: {
            path: "routeId",
            populate: [
              {
                path: "startStopId",
              },
              {
                path: "endStopId",
              },
            ],
          },
        },
        {
          path: "seatIds",
        },
      ],
    });
    if (booking.status === BookingStatus.CONFIRMED) {
      const setting = await this.settingService.findOne({});
      this.mailService.sendBookingMail(
        booking as any,
        `${booking.customerInfo.email},${setting.email}`,
      );
    }
    return booking;
  }

  async getSeatsBookedByTripIds(tripIds: ObjectId[]) {
    const now = new Date();

    const results: {
      _id: ObjectId;
      seatIds: ObjectId[];
    }[] = await this.bookingService.aggregate([
      {
        $match: {
          tripId: { $in: tripIds },
          $or: [
            { status: { $in: [BookingStatus.COMPLETED, BookingStatus.CONFIRMED] } },
            {
              status: BookingStatus.PENDING,
              expireAt: { $gt: now },
            },
          ],
        },
      },
      { $unwind: "$seatIds" },
      {
        $group: {
          _id: "$tripId",
          seatIds: { $addToSet: "$seatIds" },
        },
      },
    ]);

    // Map lại cho dễ dùng
    const map = new Map<string, ObjectId[]>();

    for (const tripId of tripIds) {
      map.set(tripId.toString(), []);
    }

    for (const row of results) {
      map.set(row._id.toString(), row.seatIds);
    }

    return map;
  }

  async checkoutBySepay({ id: sepayId, ...input }: SepayTransferNotify) {
    const booking: BookingDocument = await this.bookingService.updateOne(
      {
        code: input.code,
      },
      {
        status: BookingStatus.CONFIRMED,
        "paymentInfo.status": PaymentStatus.PAID,
        "paymentInfo.paidAt": Date.now(),
        $inc: {
          "paymentInfo.paidAmount": input.transferAmount,
        },
        $push: {
          sepayHistories: {
            ...input,
            sepayId,
            createdAt: Date.now(),
          },
        },
      },
    );

    const setting = await this.settingService.findOne({});
    this.mailService
      .sendBookingMail(booking as any, `${booking.customerInfo.email},${setting.email}`)
      .catch(() => {
        // ignore
      });

    return booking;
  }
}
