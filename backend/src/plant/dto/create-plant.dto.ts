import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString, Min } from 'class-validator';

export class CreatePlantDto {
    // 1. Plant Identity & Status
    @ApiProperty({ example: 'Sector 45 Solar Grid' })
    @IsString()
    plantName: string;

    @ApiProperty({ example: 'SOL-2024-001' })
    @IsString()
    plantCode: string;

    @ApiProperty({ example: 'grid_connected', required: false })
    @IsString()
    @IsOptional()
    plantType?: string;

    @ApiProperty({ example: 500 })
    @IsNumber()
    @Min(0)
    capacity: number;

    @ApiProperty({ example: 'draft', required: false })
    @IsString()
    @IsOptional()
    status?: string;

    @ApiProperty({ example: 'RA-001', required: false })
    @IsString()
    @IsOptional()
    regionAdminId?: string;

    // 2. Location & Grid Info
    @ApiProperty({ example: 'Delhi, India' })
    @IsString()
    location: string;

    @ApiProperty({ example: 28.7041 })
    @IsNumber()
    latitude: number;

    @ApiProperty({ example: 77.1025 })
    @IsNumber()
    longitude: number;

    @ApiProperty({ example: 'India', required: false })
    @IsString()
    @IsOptional()
    country?: string;

    @ApiProperty({ example: 'Delhi', required: false })
    @IsString()
    @IsOptional()
    state?: string;

    @ApiProperty({ example: 'New Delhi', required: false })
    @IsString()
    @IsOptional()
    city?: string;

    @ApiProperty({ example: 'BSES Rajdhani', required: false })
    @IsString()
    @IsOptional()
    utilityName?: string;

    @ApiProperty({ example: 'lt', required: false })
    @IsString()
    @IsOptional()
    gridVoltage?: string;

    @ApiProperty({ example: 'yes', required: false })
    @IsString()
    @IsOptional()
    netMetering?: string;

    @ApiProperty({ example: '2024-01-15', required: false })
    @IsDateString()
    @IsOptional()
    connectionDate?: string;

    // 3. Electrical Configuration
    @ApiProperty({ example: 'string', required: false })
    @IsString()
    @IsOptional()
    inverterType?: string;

    @ApiProperty({ example: 'Sungrow SG110CX', required: false })
    @IsString()
    @IsOptional()
    inverterMake?: string;

    @ApiProperty({ example: 5, required: false })
    @IsNumber()
    @IsOptional()
    inverterCount?: number;

    @ApiProperty({ example: 100, required: false })
    @IsNumber()
    @IsOptional()
    inverterRatedPower?: number;

    @ApiProperty({ example: 'no', required: false })
    @IsString()
    @IsOptional()
    transformerPresent?: string;

    @ApiProperty({ example: '0.415 kV / 11 kV', required: false })
    @IsString()
    @IsOptional()
    transformerRating?: string;

    @ApiProperty({ example: 500, required: false })
    @IsNumber()
    @IsOptional()
    transformerCapacity?: number;

    // 4. Metering & Sensors
    @ApiProperty({ example: 'bi_directional', required: false })
    @IsString()
    @IsOptional()
    meterType?: string;

    @ApiProperty({ example: 'Secure Premier', required: false })
    @IsString()
    @IsOptional()
    meterMake?: string;

    @ApiProperty({ example: 'modbus_rtu', required: false })
    @IsString()
    @IsOptional()
    meterProtocol?: string;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    solarIrradiance?: boolean;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    ambientTemp?: boolean;

    @ApiProperty({ example: false, required: false })
    @IsBoolean()
    @IsOptional()
    moduleTemp?: boolean;

    // 5. Connectivity
    @ApiProperty({ example: 'modbus_tcp', required: false })
    @IsString()
    @IsOptional()
    dataProtocol?: string;

    @ApiProperty({ example: 'DLOG-X99', required: false })
    @IsString()
    @IsOptional()
    loggerId?: string;

    @ApiProperty({ example: '4g', required: false })
    @IsString()
    @IsOptional()
    internetType?: string;

    @ApiProperty({ example: '15', required: false })
    @IsString()
    @IsOptional()
    dataPushInterval?: string;

    // 6. Control & Safety
    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    antiIslanding?: boolean;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    protectionEnabled?: boolean;

    @ApiProperty({ example: 'no', required: false })
    @IsString()
    @IsOptional()
    curtailmentAllowed?: string;

    // 7. Owner/Access Info
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    ownerName: string;

    @ApiProperty({ example: '+91 98765 43210' })
    @IsString()
    ownerPhone: string;

    @ApiProperty({ example: 'john@example.com', required: false })
    @IsString()
    @IsOptional()
    ownerEmail?: string;

    // Optional fields
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    image?: string;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    generation?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    efficiency?: number;
}
