import { Controller, Get, Post, Put, Delete, Body, Param, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { CostEstimationService } from './cost-estimation.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { Request } from 'express';

@Controller('cost-estimation')
export class CostEstimationController {
    constructor(private readonly costEstimationService: CostEstimationService) {}

    @UseGuards(AccessTokenGuard)
    @Post()
    create(@Body() dto: any, @Req() req: Request) {
        const userId = (req as any).user?.sub ?? null;
        return this.costEstimationService.create(dto, userId);
    }

    @Get()
    findAll() {
        return this.costEstimationService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        const numId = parseInt(id, 10);
        if (isNaN(numId)) throw new BadRequestException('Invalid ID');
        return this.costEstimationService.findOne(numId);
    }

    @UseGuards(AccessTokenGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() dto: any) {
        const numId = parseInt(id, 10);
        if (isNaN(numId)) throw new BadRequestException('Invalid ID');
        return this.costEstimationService.update(numId, dto);
    }

    @UseGuards(AccessTokenGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        const numId = parseInt(id, 10);
        if (isNaN(numId)) throw new BadRequestException('Invalid ID');
        return this.costEstimationService.remove(numId);
    }

    @UseGuards(AccessTokenGuard)
    @Post(':id/finalize')
    finalize(@Param('id') id: string) {
        const numId = parseInt(id, 10);
        if (isNaN(numId)) throw new BadRequestException('Invalid ID');
        return this.costEstimationService.finalize(numId);
    }

    @UseGuards(AccessTokenGuard)
    @Post('generate-from-survey/:surveyId')
    generateFromSurvey(@Param('surveyId') surveyId: string, @Req() req: Request) {
        const numId = parseInt(surveyId, 10);
        if (isNaN(numId)) throw new BadRequestException('Invalid Survey ID');
        const userId = (req as any).user?.sub ?? null;
        return this.costEstimationService.generateFromSurvey(numId, userId);
    }
}
