import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TripPrice, TripPriceSchema } from "./schemas/trip_price.schema";
import { TripPriceController } from "./trip_price.controller";
import { TripPriceService } from "./trip_price.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TripPrice.name,
        schema: TripPriceSchema,
      },
    ]),
  ],
  controllers: [TripPriceController],
  providers: [TripPriceService],
  exports: [TripPriceService],
})
export class TripPriceModule {}
