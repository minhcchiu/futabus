import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { differenceInMinutes } from "date-fns";
import { EnvStatic } from "src/configurations/env.static";
import { BookingDocument } from "~modules/10-bookings/schemas/booking.schema";
import { SeatDocument } from "~modules/3-seats/schemas/seat.schema";
import { StopLocationDocument } from "~modules/4-stop_locations/schemas/stop_location.schema";
import { RouteDocument } from "~modules/5-routes/schemas/route.schema";
import { TripDocument } from "~modules/7-trips/schemas/trip.schema";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  sendMail(options: ISendMailOptions) {
    return this.mailerService.sendMail(options);
  }

  async sendOTP(
    data: {
      otpCode: string;
      expiredAt: number;
    },
    to: string,
    subject: string,
    from?: string,
  ) {
    const { name, defaults } = EnvStatic.getMailerConfig();
    const params = {
      from: from ?? `"${name} ⭐" <${defaults.from}>`,
      to,
      subject,
      template: "./otp/otp.template.hbs",
      context: { verificationCode: data.otpCode },
    };

    // send mail
    return this.sendMail(params);
  }

  async sendUserToken(
    body: { token: string; expiresAt: Date; fullName: string },
    to: string,
    from?: string,
  ) {
    const { name, defaults } = EnvStatic.getMailerConfig();
    const { verifyAccountUrl } = EnvStatic.getAppConfig();

    const expiresIn = differenceInMinutes(body.expiresAt, new Date());
    const verificationLink = `${verifyAccountUrl}?token=${body.token}`;

    // options
    const options = {
      from: from ?? `"${name} ⭐" <${defaults.from}>`,
      to,
      subject: "Register account.",
      template: "./verify/account-register.template.hbs",
      context: { verificationLink, expiresIn, fullName: body.fullName },
    };

    // Send
    return this.sendMail(options);
  }

  async sendForgotPasswordToken(
    body: { token: string; expiresAt: Date; fullName: string },
    to: string,
    from?: string,
  ) {
    const { name, defaults } = EnvStatic.getMailerConfig();
    const { resetPasswordUrl } = EnvStatic.getAppConfig();

    const expiresIn = differenceInMinutes(body.expiresAt, new Date());
    const resetPasswordLink = `${resetPasswordUrl}?token=${body.token}`;

    // options
    const options: ISendMailOptions = {
      to,
      subject: "Forgot Password - Reset Your Password",
      template: "./verify/password-reset.template.hbs",
      context: { resetPasswordLink, expiresIn, fullName: body.fullName },
      from: from ?? `"${name}" <${defaults.from}>`,
    };

    // Send
    return this.sendMail(options);
  }

  async sendBookingMail(
    booking: BookingDocument & {
      seatIds: SeatDocument[];
      tripId: TripDocument & {
        routeId: RouteDocument & {
          startStopId: StopLocationDocument;
          endStopId: StopLocationDocument;
        };
      };
    },
  ) {
    const data = {
      BOOKING_CODE: booking.departureTime,
      CUSTOMER_NAME: booking.customerInfo.name,
      CUSTOMER_PHONE: booking.customerInfo.phone,
      START_STOP: booking.tripId.routeId.startStopId.name,
      END_STOP: booking.tripId.routeId.endStopId.name,
      SEATS: booking.seatIds.map((s: any) => s.name).join(", "),
      DEPARTURE_TIME: booking.departureTime,
      PAYMENT_METHOD: booking.paymentInfo.method,
      PAYMENT_STATUS_COLOR: booking.paymentInfo.status,
      PAYMENT_STATUS: booking.paymentInfo.status,
      AMOUNT: booking.amount,
      EXPIRE_TIME: booking.expireAt,
      YEAR: new Date().getFullYear(),
    };

    // options
    const options: ISendMailOptions = {
      to: booking.customerInfo.email,
      subject: "Booking confirmation",
      template: "./booking/booking.template.hbs",
      context: data,
      from: `no-reply@futabus.com`,
    };

    // Send
    return this.sendMail(options);
  }
}
