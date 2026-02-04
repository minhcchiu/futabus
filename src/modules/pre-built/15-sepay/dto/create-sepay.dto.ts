import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { BankInfoDto } from "~modules/pre-built/11-settings/dto/create-setting.dto";

export class CreateSepayDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  bin: string;

  @IsOptional()
  @IsString()
  shortName: string;

  @IsOptional()
  @IsString()
  logo: string;

  @IsOptional()
  @IsNumber()
  transferSupported: number;

  @IsOptional()
  @IsNumber()
  lookupSupported: number;

  @IsOptional()
  @IsString()
  short_name: string;

  @IsOptional()
  @IsNumber()
  support: number;

  @IsOptional()
  @IsNumber()
  isTransfer: number;

  @IsOptional()
  @IsString()
  swift_code: string;

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  bankInfo: BankInfoDto;

  @IsOptional()
  @IsBoolean()
  isUse: boolean;
}
