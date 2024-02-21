import { IsOptional, IsString, IsEmail } from '@nestjs/class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @IsEmail()
  @IsOptional()
  readonly phone?: string;

  @IsString()
  @IsOptional()
  readonly password?: string;

}