import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({example:'Full Name', description:'The full name of the Customer'})
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '7277826285' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({example:'Customer', description:'The role of the user'})
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ example: 'true' })
  @IsOptional()
  @IsBoolean()
  termOfService?: boolean;
}
