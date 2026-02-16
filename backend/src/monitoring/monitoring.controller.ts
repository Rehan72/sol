import { MonitoringService } from './monitoring.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { TierGuard, RequiredTier } from '../common/guards/tier.guard';
import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';

@Controller('monitoring')
@UseGuards(AccessTokenGuard, TierGuard)
export class MonitoringController {
    constructor(private readonly monitoringService: MonitoringService) {}

    @Post('simulate')
    @RequiredTier('PRO')
    async triggerSimulation() {
        await this.monitoringService.simulateTelemetryPulse();
        return { message: 'Telemetry pulse simulated successfully' };
    }

    @Get('live/:plantId')
    @RequiredTier('PRO')
    getLiveStatus(@Param('plantId') plantId: string) {
        return this.monitoringService.getLiveStatus(plantId);
    }

    @Get('history/:plantId')
    @RequiredTier('PRO')
    getHistory(
        @Param('plantId') plantId: string,
        @Query('limit') limit: string
    ) {
        return this.monitoringService.getRecentLogs(plantId, limit ? parseInt(limit) : 24);
    }

    @Get('forecast/:plantId')
    @RequiredTier('PRO')
    getForecast(@Param('plantId') plantId: string) {
        return this.monitoringService.getGenerationForecast(plantId);
    }
}
