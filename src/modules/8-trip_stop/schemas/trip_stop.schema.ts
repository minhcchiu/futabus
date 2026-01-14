import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { StopLocation } from "~modules/4-stop_locations/schemas/stop_location.schema";
import { Trip } from "~modules/7-trips/schemas/trip.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "trip_stops",
})
export class TripStop {
  @Prop({ type: SchemaTypes.ObjectId, ref: Trip.name, required: true })
  tripId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: StopLocation.name, required: true })
  stopId: ObjectId;

  @Prop({ type: Number })
  arrivalTime?: number;

  @Prop({ type: Number })
  departureTime?: number;
}

export type TripStopDocument = TripStop & HydratedDocument<TripStop>;
export const TripStopSchema = SchemaFactory.createForClass(TripStop);
