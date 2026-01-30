import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { UpdateBookingDto } from "~modules/10-bookings/dto/update-booking.dto";
import { MailService } from "~shared/mail/mail.service";
import { PaymentStatus } from "./enums/payment-status.enum";
import { Booking, BookingDocument } from "./schemas/booking.schema";

@Injectable()
export class BookingService extends BaseService<BookingDocument> {
  private readonly bookingService: BookingService;
  constructor(
    @InjectModel(Booking.name) model: Model<BookingDocument>,
    private readonly mailService: MailService,
  ) {
    super(model);
    this.bookingService = this;
  }

  async updateBookingStatus(id: ObjectId, body: UpdateBookingDto) {
    if (body.paymentInfo) {
      Object.keys(body.paymentInfo).forEach(key => {
        (body as any)[`paymentInfo.${key}`] = (body.paymentInfo as any)[key];
      });

      delete body.paymentInfo;
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
    if (booking.paymentInfo.status === PaymentStatus.PAID) {
      await this.mailService.sendBookingMail(booking as any);
    }
    return booking;
  }
}
