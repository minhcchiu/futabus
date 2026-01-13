import { IsNotEmpty, IsString } from "class-validator";

export class CreateRouteStopDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
