import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';
import { GenerationLog } from '../entities/generation-log.entity';
import { Plant } from '../entities/plant.entity';

@Module({
    imports: [TypeOrmModule.forFeature([GenerationLog, Plant])],
    controllers: [MonitoringController],
    providers: [MonitoringService],
    exports: [MonitoringService]
})
export class MonitoringModule implements OnModuleInit {
    constructor(private readonly monitoringService: MonitoringService) {}

    async onModuleInit() {
        // Initial peak generation simulation
        await this.monitoringService.simulateTelemetryPulse();
        
        // Background pulse every 5 minutes (300,000ms)
        setInterval(() => {
            this.monitoringService.simulateTelemetryPulse().catch(err => {
                console.error('Telemetry Simulation Failed:', err);
            });
        }, 300000);
    }
}
