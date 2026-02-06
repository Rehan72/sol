import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CustomerOnboardingDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiProperty()
    @IsNumber()
    latitude: number;

    @ApiProperty()
    @IsNumber()
    longitude: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    state: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    pincode: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    propertyType: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    roofType: string;

    @ApiProperty()
    @IsNumber()
    roofArea: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    billRange: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    solarType: string;
}