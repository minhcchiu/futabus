import { IsOptional, IsString } from "class-validator";

export class BankInfoDto {
  @IsOptional()
  @IsString()
  bankName: string;

  @IsOptional()
  @IsString()
  accountNumber: string;

  @IsOptional()
  @IsString()
  accountHolder?: string;

  @IsOptional()
  @IsString()
  qr?: string;
}
export class CreateSettingDto {
  @IsOptional()
  @IsString()
  zalo: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  logo: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  shortName: string;

  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  website: string;

  @IsOptional()
  @IsString()
  fax: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  mapLink: string;

  @IsOptional()
  @IsString()
  termsOfUse: string;

  @IsOptional()
  @IsString()
  privacyPolicy: string;

  @IsOptional()
  @IsString()
  coverImage: string;

  @IsOptional()
  @IsString()
  banner: string;

  @IsOptional()
  bankInfo: BankInfoDto;
}
