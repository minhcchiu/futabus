import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { StopLocation } from "~modules/4-stop_locations/schemas/stop_location.schema";
import { Route } from "~modules/5-routes/schemas/route.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "route_stops",
})
export class RouteStop {
  @Prop({ type: SchemaTypes.ObjectId, ref: Route.name })
  routeId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: StopLocation.name })
  stopLocationId: ObjectId;

  @Prop({ type: Number, default: 0 })
  order: number = 0;

  @Prop({ type: Boolean, default: false })
  isPickup: boolean = false;

  @Prop({ type: Boolean, default: false })
  isDropOff: boolean = false;

  @Prop({ type: Number, default: 0 })
  distanceFromStart: number = 0;
}

export type RouteStopDocument = RouteStop & HydratedDocument<RouteStop>;
export const RouteStopSchema = SchemaFactory.createForClass(RouteStop);
