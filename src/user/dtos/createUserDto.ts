import { IsString, IsEmail, isString, isEmail } from "@nestjs/class-validator";

export class CreateUserDto {

  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsEmail()
  readonly email:string;

  @IsString()
  readonly phone:string;

  @IsString()
  readonly password:string;
}