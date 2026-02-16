import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';

@Controller('subscription')
@UseGuards(AccessTokenGuard)
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    @Get('status')
    getSubscriptionStatus(@Request() req) {
        return this.subscriptionService.getSubscriptionStatus(req.user.id);
    }

    @Post('upgrade')
    upgradeTier(@Request() req, @Body('tier') tier: 'BASIC' | 'PRO' | 'ELITE') {
        return this.subscriptionService.upgradeTier(req.user.id, tier);
    }
}
