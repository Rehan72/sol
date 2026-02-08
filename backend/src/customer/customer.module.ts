import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { User } from '../entities/user.entity';
import { Plant } from '../entities/plant.entity';
import { Team } from '../entities/team.entity';
import { Quotation } from '../entities/quotation.entity';

import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Plant, Team, Quotation]), AuditModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule { }
