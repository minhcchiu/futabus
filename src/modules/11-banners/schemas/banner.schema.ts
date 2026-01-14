import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
  timestamps: true,
  versionKey: false,
  collection: "banners",
})
export class Banner {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: Boolean, default: true })
  isShow?: boolean;
}

export type BannerDocument = Banner & HydratedDocument<Banner>;
export const BannerSchema = SchemaFactory.createForClass(Banner);
