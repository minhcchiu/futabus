import { PartialType } from "@nestjs/mapped-types";
import { CreateSepayDto } from "~modules/pre-built/15-sepay/dto/create-sepay.dto";

export class UpdateSepayDto extends PartialType(CreateSepayDto) {}
