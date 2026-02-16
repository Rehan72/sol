import { Controller, Get } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
    constructor(private readonly portfolioService: PortfolioService) {}

    @Get('stats')
    getStats() {
        return this.portfolioService.getAggregatedStats();
    }

    @Get('plants')
    getPlantPerformance() {
        return this.portfolioService.getPlantWisePerformance();
    }
}
