import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRegionAdminDto } from './create-region-admin.dto';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateRegionAdminDto extends PartialType(CreateRegionAdminDto) {
  @ApiProperty({ example: 'John Updated Doe', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '+919876543211', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

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

  @ApiProperty({ example: 'North Zone Updated', required: false })
  @IsString()
  @IsOptional()
  regionName?: string;

  @ApiProperty({ example: 'RE-NORTH-02', required: false })
  @IsString()
  @IsOptional()
  regionCode?: string;

  @ApiProperty({ example: 'India', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ example: 'Adani Power', required: false })
  @IsString()
  @IsOptional()
  utility?: string;

  @ApiProperty({ example: 19.0760, required: false })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({ example: 72.8777, required: false })
  @IsNumber()
  @IsOptional()
  longitude?: number;
}
