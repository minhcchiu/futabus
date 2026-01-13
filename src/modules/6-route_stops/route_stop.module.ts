import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RouteStopController } from "./route_stop.controller";
import { RouteStopService } from "./route_stop.service";
import { RouteStop, RouteStopSchema } from "./schemas/route_stop.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RouteStop.name,
        schema: RouteStopSchema,
      },
    ]),
  ],
  controllers: [RouteStopController],
  providers: [RouteStopService],
  exports: [RouteStopService],
})
export class RouteStopModule {}
