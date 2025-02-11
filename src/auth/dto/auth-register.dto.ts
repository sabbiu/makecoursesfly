import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class AuthRegisterDto {
  name: string;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  password: string;

  @IsEmail()
  email: string;

  photo?: string;
}
