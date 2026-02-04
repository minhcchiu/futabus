import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseService } from "~base-inherit/base.service";
import { GenerateQrCodeDto } from "~modules/pre-built/15-sepay/dto/generate-qr-code.dto";
import { Sepay, SepayDocument } from "./schemas/sepay.schema";

@Injectable()
export class SepayService extends BaseService<SepayDocument> {
  constructor(@InjectModel(Sepay.name) model: Model<SepayDocument>) {
    super(model);
  }

  async generateQRCode(input: GenerateQrCodeDto) {
    const url = `https://qr.sepay.vn/img?acc=${input.bankInfo.accountNumber}&bank=${input.bankInfo.bankName}&amount=${input.amount}&des=ML${input.orderCode}&template=compact`;

    return { url };
  }
}
