import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { Seat } from "~modules/3-seats/schemas/seat.schema";
import { StopLocation } from "~modules/4-stop_locations/schemas/stop_location.schema";
import { Trip } from "~modules/7-trips/schemas/trip.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "trip_prices",
})
export class TripPrice {
  @Prop({ type: SchemaTypes.ObjectId, ref: Trip.name, required: true })
  tripId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: StopLocation.name })
  fromStopId?: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: StopLocation.name })
  toStopId?: ObjectId;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: Seat.name, required: true })
  seatId: ObjectId;
}

export type TripPriceDocument = TripPrice & HydratedDocument<TripPrice>;
export const TripPriceSchema = SchemaFactory.createForClass(TripPrice);
