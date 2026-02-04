import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { BankInfoDto } from "~modules/pre-built/11-settings/dto/create-setting.dto";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "sepay",
})
export class Sepay {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String, unique: true })
  code: string;

  @Prop({ type: String })
  bin: string;

  @Prop({ type: String })
  shortName: string;

  @Prop({ type: String })
  logo: string;

  @Prop({ type: Number })
  transferSupported: number;

  @Prop({ type: Number })
  lookupSupported: number;

  @Prop({ type: String })
  short_name: string;

  @Prop({ type: Number })
  support: number;

  @Prop({ type: Number })
  isTransfer: number;

  @Prop({ type: String })
  swift_code: string;

  @Prop({ type: String })
  note: string;

  @Prop({ type: Object })
  bankInfo: BankInfoDto;

  @Prop({ type: Boolean })
  isUse: boolean;
}

export type SepayDocument = Sepay & HydratedDocument<Sepay>;
export const SepaySchema = SchemaFactory.createForClass(Sepay);
