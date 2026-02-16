import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GenerationLog } from '../entities/generation-log.entity';
import { Plant } from '../entities/plant.entity';

@Injectable()
export class MonitoringService {
    private readonly logger = new Logger(MonitoringService.name);

    constructor(
        @InjectRepository(GenerationLog)
        private logRepo: Repository<GenerationLog>,
        @InjectRepository(Plant)
        private plantRepo: Repository<Plant>,
        private eventEmitter: EventEmitter2
    ) {}

    async saveTelemetry(plantId: string, data: any) {
        const log = this.logRepo.create({
            plantId,
            kwGeneration: data.kw || 0,
            efficiency: data.efficiency || 0,
            ambientTemp: data.temp || 25,
            moduleTemp: data.moduleTemp || 30,
            irradiance: data.irradiance || 800,
            timestamp: new Date()
        });
        const savedLog = await this.logRepo.save(log);
        this.eventEmitter.emit('telemetry.received', { plantId, data: savedLog });
        return savedLog;
    }

    /**
     * Simulates real-time telemetry for all operational plants.
     * In a real system, this would be an MQTT listener or Webhook target.
     */
    async simulateTelemetryPulse() {
        const plants = await this.plantRepo.find({ where: { status: 'active' } });
        const logs = plants.map(plant => {
            const hour = new Date().getHours();
            // Simple solar curve simulation based on time (peak at 13:00)
            const solarIntensity = Math.max(0, Math.sin((hour - 6) * Math.PI / 12));
            const baseGeneration = plant.capacity * solarIntensity;
            
            // Add some randomness (cloud cover effect)
            const randomness = 0.85 + Math.random() * 0.15;
            const kwGeneration = baseGeneration * randomness;
            
            return this.logRepo.create({
                plantId: plant.id,
                kwGeneration: parseFloat(kwGeneration.toFixed(2)),
                efficiency: parseFloat((randomness * 100).toFixed(1)),
                ambientTemp: parseFloat((25 + Math.random() * 15).toFixed(1)),
                moduleTemp: parseFloat((30 + Math.random() * 25).toFixed(1)),
                irradiance: parseFloat((solarIntensity * 1000 * randomness).toFixed(1))
            });
        });

        if (logs.length > 0) {
            await this.logRepo.save(logs);
            this.logger.log(`Generated telemetry pulse for ${logs.length} plants. Sample ID: ${logs[0].plantId}`);
        }
    }

    async getRecentLogs(plantId: string, limit: number = 24) {
        return this.logRepo.find({
            where: { plantId },
            order: { timestamp: 'DESC' },
            take: limit
        });
    }

    async getLiveStatus(plantId: string) {
        const lastLog = await this.logRepo.findOne({
            where: { plantId },
            order: { timestamp: 'DESC' }
        });

        if (!lastLog) return null;

        const anomaly = await this.detectAnomalies(plantId);

        return {
            currentKw: lastLog.kwGeneration,
            efficiency: lastLog.efficiency,
            ambientTemp: lastLog.ambientTemp,
            irradiance: lastLog.irradiance,
            lastPulseAt: lastLog.timestamp,
            anomaly: anomaly
        };
    }

    async detectAnomalies(plantId: string) {
        // Fetch last 10 logs to calculate moving average
        const recentLogs = await this.logRepo.find({
            where: { plantId },
            order: { timestamp: 'DESC' },
            take: 10
        });

        if (recentLogs.length < 5) return { status: 'STABLE', confidence: 100 };

        const latest = recentLogs[0];
        const averageEfficiency = recentLogs.slice(1).reduce((sum, log) => sum + log.efficiency, 0) / (recentLogs.length - 1);

        // Threshold of 15% drop triggers a warning
        const dropFactor = (averageEfficiency - latest.efficiency) / averageEfficiency;

        if (dropFactor > 0.25) {
            return { 
                status: 'CRITICAL', 
                message: 'Severe efficiency drop detected. Possible hardware fault or obstruction.',
                confidence: 92
            };
        } else if (dropFactor > 0.15) {
            return { 
                status: 'WARNING', 
                message: 'Minor efficiency fluctuation detected. Monitor for persistent drops.',
                confidence: 85
            };
        }

        return { status: 'STABLE', confidence: 98 };
    }

    async getGenerationForecast(plantId: string) {
        const plant = await this.plantRepo.findOne({ where: { id: plantId } });
        if (!plant) return [];

        const forecast = [];
        const now = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(now);
            date.setDate(now.getDate() + i);

            // Simulate weather fluctuations (0.7 to 1.1 multiplier)
            const weatherFactor = 0.7 + Math.random() * 0.4;
            const projectedKw = plant.capacity * 4.5 * weatherFactor; // 4.5 average sun hours

            forecast.push({
                date: date.toISOString().split('T')[0],
                expectedKw: parseFloat(projectedKw.toFixed(2)),
                weatherConfidence: Math.round((1 - Math.abs(1 - weatherFactor)) * 100)
            });
        }

        return forecast;
    }
}
