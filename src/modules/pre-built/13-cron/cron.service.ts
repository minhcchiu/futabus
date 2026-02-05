import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { resetSttBooking } from "~modules/10-bookings/helpers/booking-code";

@Injectable()
export class CronService {
  constructor() {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  resetCurrentBooking() {
    resetSttBooking();
  }
}
