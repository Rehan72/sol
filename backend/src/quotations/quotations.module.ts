import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationsService } from './quotations.service';
import { QuotationsController } from './quotations.controller';
import { Quotation } from '../entities/quotation.entity';
import { Survey } from '../entities/survey.entity';
import { QuotationApproval } from '../entities/quotation-approval.entity';
import { CostEstimationModule } from '../cost-estimation/cost-estimation.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Quotation, Survey, QuotationApproval]),
        CostEstimationModule
    ],
    controllers: [QuotationsController],
    providers: [QuotationsService],
    exports: [QuotationsService],
})
export class QuotationsModule { }
