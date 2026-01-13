import { PartialType } from "@nestjs/mapped-types";
import { CreateBusCompanyDto } from "./create-bus_company.dto";

export class UpdateBusCompanyDto extends PartialType(CreateBusCompanyDto) {}
