import { IsNotEmpty, IsString } from "class-validator";

export class CreateTripDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
