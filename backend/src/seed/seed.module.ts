import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../entities/user.entity';
import { Plant } from '../entities/plant.entity';
import { Quotation } from '../entities/quotation.entity';
import { Ticket } from '../entities/ticket.entity';
import { GenerationLog } from '../entities/generation-log.entity';
import { Survey } from '../entities/survey.entity';
import { Team } from '../entities/team.entity';
import { PricingRule } from '../entities/pricing-rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    User, 
    Plant, 
    Quotation, 
    Ticket, 
    GenerationLog, 
    Survey, 
    Team,
    PricingRule
  ])],
  providers: [SeedService],
})
export class SeedModule {}
