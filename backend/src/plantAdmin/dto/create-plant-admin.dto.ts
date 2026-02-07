import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, IsUUID } from 'class-validator';

export class CreatePlantAdminDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'john.doe@plantadmin.com' })
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

    @ApiProperty({ example: 'active', required: false })
    @IsString()
    @IsOptional()
    status?: string;

    @ApiProperty({ example: 'uuid-of-plant', description: 'UUID of the plant to assign' })
    @IsUUID()
    @IsNotEmpty()
    assignedPlantId: string;
}
