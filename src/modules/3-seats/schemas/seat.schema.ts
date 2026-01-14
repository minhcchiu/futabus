import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { Vehicle } from "~modules/2-vehicles/schemas/vehicle.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "seats",
})
export class Seat {
  @Prop({ type: SchemaTypes.ObjectId, ref: Vehicle.name, required: true })
  vehicleId: ObjectId;

  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: Number, enum: [1, 2], required: true })
  floor: number;

  @Prop({ type: String, required: true })
  row: string;

  @Prop({ type: String, required: true })
  column: string;
}

export type SeatDocument = Seat & HydratedDocument<Seat>;
export const SeatSchema = SchemaFactory.createForClass(Seat);
