import { PartialType } from "@nestjs/mapped-types";
import { CreateTripStopDto } from "./create-trip_stop.dto";

export class UpdateTripStopDto extends PartialType(CreateTripStopDto) {}
