import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBannerDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsOptional()
  @IsBoolean()
  isShow?: boolean;
}
