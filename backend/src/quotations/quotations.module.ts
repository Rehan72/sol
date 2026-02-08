import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationsService } from './quotations.service';
import { QuotationsController } from './quotations.controller';
import { Quotation } from '../entities/quotation.entity';
import { Survey } from '../entities/survey.entity';
import { QuotationApproval } from '../entities/quotation-approval.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Quotation, Survey, QuotationApproval])],
    controllers: [QuotationsController],
    providers: [QuotationsService],
    exports: [QuotationsService],
})
export class QuotationsModule { }
