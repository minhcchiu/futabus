import { IsNotEmpty, IsString } from "class-validator";

export class CreateBusCompanyDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
