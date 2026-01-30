import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { BusCompany } from "~modules/1-bus_companies/schemas/bus_company.schema";
import { StopLocation } from "~modules/4-stop_locations/schemas/stop_location.schema";
@Schema({
  timestamps: true,
  versionKey: false,
  collection: "routes",
})
export class Route {
  @Prop({ type: SchemaTypes.ObjectId, ref: BusCompany.name })
  companyId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: StopLocation.name })
  startStopId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: StopLocation.name })
  endStopId: ObjectId;

  @Prop({ type: Number })
  durationMinutes?: number;
}

export type RouteDocument = Route & HydratedDocument<Route>;
export const RouteSchema = SchemaFactory.createForClass(Route);
