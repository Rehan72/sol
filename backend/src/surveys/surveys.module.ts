import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveysService } from './surveys.service';
import { SurveysController } from './surveys.controller';
import { Survey } from '../entities/survey.entity';
import { User } from '../entities/user.entity';
import { QuotationsModule } from '../quotations/quotations.module';
import { CostEstimationModule } from '../cost-estimation/cost-estimation.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Survey, User]),
        QuotationsModule,
        CostEstimationModule
    ],
    controllers: [SurveysController],
    providers: [SurveysService],
})
export class SurveysModule { }
