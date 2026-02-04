import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { BankInfoDto } from "~modules/pre-built/11-settings/dto/create-setting.dto";

export type SepayTransferNotify = {
  gateway: string; // TPBank
  transactionDate: string; // "2026-02-04 08:43:55"
  accountNumber: string; // "00002709360"
  subAccount: string | null;
  code: string; // ML2602040
  content: string; // ML2602040
  transferType: "in" | "out";
  description: string;
  transferAmount: number; // 5000
  referenceCode: string; // 373ITC1260350663
  accumulated: number; // 190882
  id: number; // 41111631
};

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
