import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { BusCompany } from "~modules/1-bus_companies/schemas/bus_company.schema";
import { VehicleLevelEnum } from "~modules/2-vehicles/enums/vehicle-level.enum";
import { VehicleStatusEnum } from "~modules/2-vehicles/enums/vehicle-status.enum";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "vehicles",
})
export class Vehicle {
  @Prop({ type: SchemaTypes.ObjectId, ref: BusCompany.name, required: true })
  companyId: ObjectId;

  @Prop({ type: String, required: true })
  plateNumber: string;

  @Prop({ type: String, enum: VehicleLevelEnum, default: VehicleLevelEnum.SLEEPER })
  level: VehicleLevelEnum = VehicleLevelEnum.SLEEPER;

  @Prop({ type: String, enum: VehicleStatusEnum, default: VehicleStatusEnum.ACTIVE })
  status: VehicleStatusEnum = VehicleStatusEnum.ACTIVE;

  @Prop({ type: [String] })
  amenities: string[]; // wifi, tv, massage, water...
}

export type VehicleDocument = Vehicle & HydratedDocument<Vehicle>;
export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
