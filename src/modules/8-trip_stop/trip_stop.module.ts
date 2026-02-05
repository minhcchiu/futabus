import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TripModule } from "~modules/7-trips/trip.module";
import { TripStop, TripStopSchema } from "./schemas/trip_stop.schema";
import { TripStopController } from "./trip_stop.controller";
import { TripStopService } from "./trip_stop.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TripStop.name,
        schema: TripStopSchema,
      },
    ]),
    forwardRef(() => TripModule),
  ],
  controllers: [TripStopController],
  providers: [TripStopService],
  exports: [TripStopService],
})
export class TripStopModule {}
