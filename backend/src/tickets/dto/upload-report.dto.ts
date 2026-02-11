import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadReportDto {
    @ApiProperty({ description: 'Summary of the visit' })
    @IsNotEmpty()
    @IsString()
    summary: string;

    @ApiProperty({ description: 'Whether defects were found' })
    @IsNotEmpty()
    @IsBoolean()
    defectFound: boolean;

    @ApiProperty({ description: 'Detailed findings' })
    @IsOptional()
    @IsString()
    findings?: string;

    @ApiProperty({ description: 'Attachment URLs', required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    attachments?: string[];
}
