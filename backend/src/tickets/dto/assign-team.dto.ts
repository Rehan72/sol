import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTeamDto {
    @ApiProperty({ description: 'UUID of the maintenance team' })
    @IsNotEmpty()
    @IsUUID()
    teamId: string;
}
