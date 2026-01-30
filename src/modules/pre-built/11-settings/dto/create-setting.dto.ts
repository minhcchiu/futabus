import { IsOptional, IsString } from "class-validator";

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
  termsOfUse: string;

  @IsOptional()
  @IsString()
  privacyPolicy: string;
}
