import { Controller, Get, Query } from '@nestjs/common';
import { FinancialIntelligenceService } from './financial-intelligence.service';

@Controller('financials')
export class FinancialsController {
    constructor(private readonly financialService: FinancialIntelligenceService) {}

    @Get('analyze')
    analyze(
        @Query('capacity') capacity: string,
        @Query('cost') cost: string,
        @Query('tariff') tariff: string
    ) {
        return this.financialService.calculateFinancialImpact(
            parseFloat(capacity),
            parseFloat(cost),
            parseFloat(tariff)
        );
    }

    @Get('environmental-impact')
    getEnvImpact(@Query('capacity') capacity: string) {
        return this.financialService.calculateEnvironmentalImpact(parseFloat(capacity));
    }

    @Get('gst-benefit')
    getGstBenefit(@Query('cost') cost: string) {
        return this.financialService.calculateGstSavings(parseFloat(cost));
    }

    @Get('loan-model')
    getLoanModel(
        @Query('cost') cost: string,
        @Query('rate') rate: string,
        @Query('years') years: string
    ) {
        return this.financialService.getLoanRepaymentModel(
            parseFloat(cost),
            rate ? parseFloat(rate) : 8.5,
            years ? parseInt(years) : 10
        );
    }
}
