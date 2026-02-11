import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
    @ApiProperty({ description: 'Description of the issue' })
    @IsNotEmpty()
    @IsString()
    description: string;
}
