import { IsNotEmpty, IsString } from "class-validator";

export class CreateTripPriceDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
