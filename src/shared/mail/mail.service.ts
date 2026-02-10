import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { differenceInMinutes } from "date-fns";
import { EnvStatic } from "src/configurations/env.static";
import { PaymentMethod } from "~modules/10-bookings/enums/payment-method.enum";
import { PaymentStatus } from "~modules/10-bookings/enums/payment-status.enum";
import { BookingDocument } from "~modules/10-bookings/schemas/booking.schema";
import { SeatDocument } from "~modules/3-seats/schemas/seat.schema";
import { StopLocationDocument } from "~modules/4-stop_locations/schemas/stop_location.schema";
import { RouteDocument } from "~modules/5-routes/schemas/route.schema";
import { TripDocument } from "~modules/7-trips/schemas/trip.schema";
import { formatDateTime, formatMoney } from "~utils/format.util";
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
        driverPhone?: string;
        routeId: RouteDocument & {
          startStopId: StopLocationDocument;
          endStopId: StopLocationDocument;
        };
      };
    },
    to?: string,
  ) {
    /* ========================
    TEXT MAP
  ======================== */
    const paymentStatusText: Record<string, string> = {
      UNPAID: "Chờ thanh toán",
      PENDING: "Đang xử lý",
      PAID: "Đã thanh toán",
      FAILED: "Thanh toán lỗi",
      REFUNDING: "Đang hoàn tiền",
      REFUNDED: "Đã hoàn tiền",
    };

    const paymentStatusColor: Record<string, string> = {
      UNPAID: "#f59e0b", // vàng
      PENDING: "#f59e0b",
      PAID: "#16a34a", // xanh
      FAILED: "#dc2626", // đỏ
      REFUNDING: "#0ea5e9", // xanh dương
      REFUNDED: "#6b7280", // xám
    };

    /* ========================
    PAYMENT NOTE
  ======================== */
    const isPaid = booking.paymentInfo.status === PaymentStatus.PAID;

    const paymentNote = isPaid
      ? "✅ Thanh toán thành công. Vui lòng đến điểm đón trước giờ khởi hành 15 phút."
      : `⏳ Vui lòng thanh toán trước <strong>${formatDateTime(
          booking.expireAt,
        )}</strong> để giữ chỗ.`;

    /* ========================
    TEMPLATE DATA
  ======================== */
    const data = {
      BOOKING_CODE: booking.code,

      // customer
      CUSTOMER_NAME: booking.customerInfo.name,
      CUSTOMER_PHONE: booking.customerInfo.phone,

      // trip
      START_STOP: booking.tripId.routeId.startStopId.name,
      END_STOP: booking.tripId.routeId.endStopId.name,
      SEATS: booking.seatIds.map((s: any) => s.name || s.code).join(", "),
      DEPARTURE_TIME: formatDateTime(booking.departureTime),
      DRIVER_PHONE: booking.tripId.driverPhone || "Đang cập nhật",

      // payment
      PAYMENT_METHOD:
        booking.paymentInfo.method === PaymentMethod.CASH
          ? "Tiền mặt tại quầy"
          : `Thanh toán qua ${booking.paymentInfo.method}`,
      PAYMENT_STATUS: paymentStatusText[booking.paymentInfo.status],
      PAYMENT_STATUS_COLOR: paymentStatusColor[booking.paymentInfo.status],
      PAYMENT_NOTE: paymentNote,
      AMOUNT: formatMoney(booking.amount),

      YEAR: new Date().getFullYear(),
    };

    /* ========================
    MAIL OPTIONS
  ======================== */
    const options: ISendMailOptions = {
      to: to || booking.customerInfo.email,
      subject: isPaid
        ? "Xác nhận vé – Thanh toán thành công"
        : "Thông tin đơn đặt vé – Chờ thanh toán",
      template: "./booking/booking.template.hbs",
      context: data,
      from: "no-reply@futabus.com",
    };

    return this.sendMail(options);
  }
}
