import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from '../entities/survey.entity';
import { CostEstimation } from '../entities/cost-estimation.entity';
import { CostEstimationController } from './cost-estimation.controller';
import { CostEstimationService } from './cost-estimation.service';

@Module({
    imports: [TypeOrmModule.forFeature([CostEstimation, Survey])],
    controllers: [CostEstimationController],
    providers: [CostEstimationService],
    exports: [CostEstimationService],
})
export class CostEstimationModule {}
