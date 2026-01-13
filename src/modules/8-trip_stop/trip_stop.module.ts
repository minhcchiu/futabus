import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
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
  ],
  controllers: [TripStopController],
  providers: [TripStopService],
  exports: [TripStopService],
})
export class TripStopModule {}
