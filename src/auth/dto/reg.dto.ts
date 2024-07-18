import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
