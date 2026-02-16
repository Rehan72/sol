import { Module } from '@nestjs/common';
import { FinancialIntelligenceService } from './financial-intelligence.service';
import { FinancialsController } from './financials.controller';

@Module({
  controllers: [FinancialsController],
  providers: [FinancialIntelligenceService],
  exports: [FinancialIntelligenceService],
})
export class FinancialsModule {}
