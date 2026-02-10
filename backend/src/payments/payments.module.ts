import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from '../entities/payment.entity';
import { Quotation } from '../entities/quotation.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Payment, Quotation, User])],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
