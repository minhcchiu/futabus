import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
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
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}
