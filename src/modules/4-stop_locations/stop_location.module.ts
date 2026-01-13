import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StopLocation, StopLocationSchema } from "./schemas/stop_location.schema";
import { StopLocationController } from "./stop_location.controller";
import { StopLocationService } from "./stop_location.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: StopLocation.name,
        schema: StopLocationSchema,
      },
    ]),
  ],
  controllers: [StopLocationController],
  providers: [StopLocationService],
  exports: [StopLocationService],
})
export class StopLocationModule {}
