import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BusCompanyController } from "./bus_company.controller";
import { BusCompanyService } from "./bus_company.service";
import { BusCompany, BusCompanySchema } from "./schemas/bus_company.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BusCompany.name,
        schema: BusCompanySchema,
      },
    ]),
  ],
  controllers: [BusCompanyController],
  providers: [BusCompanyService],
  exports: [BusCompanyService],
})
export class BusCompanyModule {}
