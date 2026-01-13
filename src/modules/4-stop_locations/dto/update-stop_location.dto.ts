import { PartialType } from "@nestjs/mapped-types";
import { CreateStopLocationDto } from "./create-stop_location.dto";

export class UpdateStopLocationDto extends PartialType(CreateStopLocationDto) {}
