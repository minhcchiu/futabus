import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SeatModule } from "~modules/3-seats/seat.module";
import { Vehicle, VehicleSchema } from "./schemas/vehicle.schema";
import { VehicleController } from "./vehicle.controller";
import { VehicleService } from "./vehicle.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Vehicle.name,
        schema: VehicleSchema,
      },
    ]),
    SeatModule,
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}
