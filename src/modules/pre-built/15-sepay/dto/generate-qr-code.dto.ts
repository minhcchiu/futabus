import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { BankInfoDto } from "~modules/pre-built/11-settings/dto/create-setting.dto";

export class GenerateQrCodeDto {
  @IsNotEmpty()
  @IsString()
  orderCode: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BankInfoDto)
  bankInfo: BankInfoDto;
}
