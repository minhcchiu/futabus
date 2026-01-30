import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "settings",
})
export class Setting {
  @Prop({ type: String })
  zalo: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  logo: string;

  @Prop({ type: String })
  banner: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  shortName: string;

  @Prop({ type: String })
  fullName: string;

  @Prop({ type: String })
  website: string;

  @Prop({ type: String })
  fax: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: String })
  termsOfUse: string;

  @Prop({ type: String })
  privacyPolicy: string;
}

export type SettingDocument = Setting & HydratedDocument<Setting>;
export const SettingSchema = SchemaFactory.createForClass(Setting);
