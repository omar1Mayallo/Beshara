import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
    message:
      'Password must contain at least one digit, one uppercase letter and one special character',
  })
  password: string;

  @IsOptional()
  @IsString()
  address?: string;
}
