import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { LocationDto } from "~common/dto/location.dto";
import { Ward } from "~modules/pre-built/10-wards/schemas/ward.schema";
import { Province } from "~modules/pre-built/8-provinces/schemas/province.schema";
import { District } from "~modules/pre-built/9-districts/schemas/district.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "stop_locations",
})
export class StopLocation {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Province.name, required: true })
  provinceId: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: District.name })
  districtId?: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Ward.name })
  wardId?: ObjectId;

  @Prop({ type: { type: String, coordinates: [Number] } })
  location?: LocationDto;
}

export type StopLocationDocument = StopLocation & HydratedDocument<StopLocation>;
export const StopLocationSchema = SchemaFactory.createForClass(StopLocation);

StopLocationSchema.index({ location: "2dsphere" });
