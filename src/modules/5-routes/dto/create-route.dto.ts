import { IsNotEmpty, IsString } from "class-validator";

export class CreateRouteDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
