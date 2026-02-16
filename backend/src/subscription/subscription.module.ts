import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { User } from '../entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [SubscriptionController],
    providers: [SubscriptionService],
    exports: [SubscriptionService]
})
export class SubscriptionModule {}
