import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Sepay, SepaySchema } from "~modules/pre-built/15-sepay/schemas/sepay.schema";
import { SepayController } from "~modules/pre-built/15-sepay/sepay.controller";
import { SepayService } from "~modules/pre-built/15-sepay/sepay.service";

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Sepay.name, schema: SepaySchema }])],
  controllers: [SepayController],
  providers: [SepayService],
  exports: [SepayService],
})
export class SepayModule {}
