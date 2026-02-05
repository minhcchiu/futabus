import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BookingModule } from "~modules/10-bookings/booking.module";
import { SeatModule } from "~modules/3-seats/seat.module";
import { TripStopModule } from "~modules/8-trip_stop/trip_stop.module";
import { TripPriceModule } from "~modules/9-trip_prices/trip_price.module";
import { Trip, TripSchema } from "./schemas/trip.schema";
import { TripController } from "./trip.controller";
import { TripService } from "./trip.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Trip.name,
        schema: TripSchema,
      },
    ]),
    TripPriceModule,
    forwardRef(() => TripStopModule),
    BookingModule,
    SeatModule,
  ],
  controllers: [TripController],
  providers: [TripService],
  exports: [TripService],
})
export class TripModule {}
