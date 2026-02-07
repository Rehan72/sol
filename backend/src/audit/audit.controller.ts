import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Audit')
@ApiBearerAuth()
@Controller('audit')
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Get()
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.PLANT_ADMIN, Role.REGION_ADMIN) // Adjusted roles as needed
    @ApiQuery({ name: 'phase', required: false })
    @ApiQuery({ name: 'action', required: false })
    async getAuditLogs(
        @Query('phase') phase?: string,
        @Query('action') action?: string,
    ) {
        return this.auditService.findAll(phase, action);
    }
}
