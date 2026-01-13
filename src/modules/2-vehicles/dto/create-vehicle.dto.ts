import { IsNotEmpty, IsString } from "class-validator";

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
