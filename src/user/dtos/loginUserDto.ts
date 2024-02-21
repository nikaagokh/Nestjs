
import { IsString, IsEmail } from '@nestjs/class-validator';

export class LoginUserDto {
  @IsString()
  readonly phone:string;

  @IsString()
  readonly password: string;
}