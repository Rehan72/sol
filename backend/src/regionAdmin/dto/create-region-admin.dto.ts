import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, IsNumber } from 'class-validator';

export class CreateRegionAdminDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'SecurePass123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Maharashtra', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: 'Mumbai', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: '400001', required: false })
  @IsString()
  @IsOptional()
  pincode?: string;

  @ApiProperty({ example: 'Western Region Office', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: 'North Zone', required: false })
  @IsString()
  @IsOptional()
  regionName?: string;

  @ApiProperty({ example: 'RE-NORTH-01', required: false })
  @IsString()
  @IsOptional()
  regionCode?: string;

  @ApiProperty({ example: 'India', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ example: 'TATA Power', required: false })
  @IsString()
  @IsOptional()
  utility?: string;

  @ApiProperty({ example: 'active', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 19.0760, required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: 72.8777, required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;
}
