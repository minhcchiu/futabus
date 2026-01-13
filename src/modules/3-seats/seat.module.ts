import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Seat, SeatSchema } from "./schemas/seat.schema";
import { SeatController } from "./seat.controller";
import { SeatService } from "./seat.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Seat.name,
        schema: SeatSchema,
      },
    ]),
  ],
  controllers: [SeatController],
  providers: [SeatService],
  exports: [SeatService],
})
export class SeatModule {}
