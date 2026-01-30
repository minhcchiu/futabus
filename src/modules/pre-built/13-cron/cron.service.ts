import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { resetSttBooking } from "~modules/10-bookings/helpers/booking-code";
import { CustomLoggerService } from "~shared/logger/custom-logger.service";

@Injectable()
export class CronService {
  constructor(private readonly logger: CustomLoggerService) {}

  @Cron(CronExpression.EVERY)
  resetCurrentBooking() {
    resetSttBooking();
  }
}
