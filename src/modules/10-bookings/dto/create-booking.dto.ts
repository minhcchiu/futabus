import { IsNotEmpty, IsString } from "class-validator";

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
