import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) {}

    async upgradeTier(userId: string, tier: 'BASIC' | 'PRO' | 'ELITE') {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        user.subscriptionTier = tier;
        // set end date to 1 year from now for demo
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);
        user.subscriptionEndDate = endDate;

        return this.userRepo.save(user);
    }

    async getSubscriptionStatus(userId: string) {
        const user = await this.userRepo.findOne({ 
            where: { id: userId },
            select: ['id', 'subscriptionTier', 'subscriptionEndDate']
        });
        if (!user) throw new NotFoundException('User not found');
        
        return user;
    }
}
