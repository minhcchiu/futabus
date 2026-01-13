import { IsNotEmpty, IsString } from "class-validator";

export class CreateStopLocationDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
