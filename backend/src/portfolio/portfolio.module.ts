import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { Plant } from '../entities/plant.entity';
import { User } from '../entities/user.entity';
import { Quotation } from '../entities/quotation.entity';
import { Ticket } from '../entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plant, User, Quotation, Ticket])],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
