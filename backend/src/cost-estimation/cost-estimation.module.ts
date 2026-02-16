import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from '../entities/survey.entity';
import { CostEstimation } from '../entities/cost-estimation.entity';
import { CostEstimationController } from './cost-estimation.controller';
import { CostEstimationService } from './cost-estimation.service';
import { PricingModule } from '../pricing/pricing.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([CostEstimation, Survey]),
        PricingModule
    ],
    controllers: [CostEstimationController],
    providers: [CostEstimationService],
    exports: [CostEstimationService],
})
export class CostEstimationModule {}
