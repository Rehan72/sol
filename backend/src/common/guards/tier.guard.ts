import { Injectable, CanActivate, ExecutionContext, ForbiddenException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const TIER_KEY = 'required_tier';
export const RequiredTier = (tier: 'BASIC' | 'PRO' | 'ELITE') => SetMetadata(TIER_KEY, tier);

const TIER_HIERARCHY = {
    'BASIC': 0,
    'PRO': 1,
    'ELITE': 2
};

@Injectable()
export class TierGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredTier = this.reflector.getAllAndOverride<'BASIC' | 'PRO' | 'ELITE'>(TIER_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredTier) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        
        // Basic users don't have the field yet in some sessions, default to BASIC
        const userTier = user?.subscriptionTier || 'BASIC';

        if (TIER_HIERARCHY[userTier] < TIER_HIERARCHY[requiredTier]) {
            throw new ForbiddenException(`This feature requires a ${requiredTier} subscription.`);
        }

        return true;
    }
}
