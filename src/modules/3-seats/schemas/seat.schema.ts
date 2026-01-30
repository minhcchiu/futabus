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

  @Prop({ type: String })
  name?: string;

  @Prop({ type: Number, enum: [1, 2], required: true })
  floor: number;

  @Prop({ type: Number, required: true })
  row: number;

  @Prop({ type: Number, required: true })
  column: number;

  @Prop({ default: false })
  isVip: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export type SeatDocument = Seat & HydratedDocument<Seat>;
export const SeatSchema = SchemaFactory.createForClass(Seat);
