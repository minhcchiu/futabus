import { PartialType } from "@nestjs/mapped-types";
import { CreateTripPriceDto } from "./create-trip_price.dto";

export class UpdateTripPriceDto extends PartialType(CreateTripPriceDto) {}
