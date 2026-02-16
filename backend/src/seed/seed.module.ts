import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../entities/user.entity';
import { PricingRule } from '../entities/pricing-rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PricingRule])],
  providers: [SeedService],
})
export class SeedModule {}
