import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongodb";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { BusCompanyStatusEnum } from "~modules/1-bus_companies/enums/bus-company-status.enum";
import { User } from "~modules/pre-built/1-users/schemas/user.schema";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "bus_companies",
})
export class BusCompany {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  userId: ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  hotline: string;

  @Prop({ type: [String] })
  hotlineList?: string[];

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  policy?: string;

  @Prop({ type: String, enum: BusCompanyStatusEnum, default: BusCompanyStatusEnum.ACTIVE })
  status?: BusCompanyStatusEnum;
}

export type BusCompanyDocument = BusCompany & HydratedDocument<BusCompany>;
export const BusCompanySchema = SchemaFactory.createForClass(BusCompany);
