import { PartialType } from "@nestjs/mapped-types";
import { CreateRouteStopDto } from "./create-route_stop.dto";

export class UpdateRouteStopDto extends PartialType(CreateRouteStopDto) {}
