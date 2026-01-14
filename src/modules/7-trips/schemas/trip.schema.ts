import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { Vehicle } from "~modules/2-vehicles/schemas/vehicle.schema";
import { Route } from "~modules/5-routes/schemas/route.schema";
import { TripStatus } from "~modules/7-trips/enums/trip-status.enum";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "trips",
})
export class Trip {
  @Prop({ type: SchemaTypes.ObjectId, ref: Route.name })
  routeId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Vehicle.name })
  vehicleId: ObjectId;

  @Prop({ type: Number })
  departureTime: number;

  @Prop({ type: String, enum: TripStatus, default: TripStatus.CREATED })
  status: TripStatus = TripStatus.CREATED;
}

export type TripDocument = Trip & HydratedDocument<Trip>;
export const TripSchema = SchemaFactory.createForClass(Trip);
