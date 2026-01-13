import { IsNotEmpty, IsString } from "class-validator";

export class CreateSeatDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
