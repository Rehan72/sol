import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingRule } from '../entities/pricing-rule.entity';

@Controller('pricing')
export class PricingController {
    constructor(private readonly pricingService: PricingService) {}

    @Get('rules')
    findAllRules() {
        return this.pricingService.findAllRules();
    }

    @Post('rules')
    createRule(@Body() data: Partial<PricingRule>) {
        return this.pricingService.createRule(data);
    }

    @Patch('rules/:id')
    updateRule(@Param('id') id: string, @Body() data: Partial<PricingRule>) {
        return this.pricingService.updateRule(+id, data);
    }

    @Delete('rules/:id')
    deleteRule(@Param('id') id: string) {
        return this.pricingService.deleteRule(+id);
    }

    @Post('sync-market')
    syncWithMarket() {
        return this.pricingService.syncWithMarket();
    }

    @Post('generate-estimation/:surveyId')
    generateEstimation(@Param('surveyId') surveyId: string) {
        return this.pricingService.generateEstimationFromSurvey(+surveyId);
    }
}
