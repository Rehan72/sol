import { Controller, Get, Post, Body, Param, Put, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowService } from './workflow.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Workflow')
@ApiBearerAuth()
@Controller('workflow')
export class WorkflowController {
    constructor(private readonly workflowService: WorkflowService) { }

    @Get(':customerId')
    @UseGuards(AccessTokenGuard)
    async getWorkflow(@Param('customerId') customerId: string) {
        return this.workflowService.getWorkflow(customerId);
    }

    @Put('step/:stepId')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.INSTALLATION_TEAM, Role.SURVEY_TEAM, Role.SUPER_ADMIN, Role.PLANT_ADMIN, Role.EMPLOYEE)
    async updateStep(
        @Param('stepId') stepId: string,
        @Body() body: { status: string; notes?: string },
        @Req() req: any
    ) {
        return this.workflowService.updateStepStatus(stepId, body.status, req.user.id, body.notes);
    }

    // Endpoint to initialize workflow for a customer (can be called when Survey is assigned)
    @Post('init/:customerId')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.PLANT_ADMIN, Role.REGION_ADMIN, Role.EMPLOYEE)
    async initWorkflow(@Param('customerId') customerId: string, @Req() req: any) {
        return this.workflowService.initializeWorkflow(customerId, req.user.id);
    }

    // Endpoint to advance workflow to next phase
    @Post('advance/:customerId')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.PLANT_ADMIN, Role.REGION_ADMIN)
    async advanceWorkflowPhase(
        @Param('customerId') customerId: string,
        @Body() body: { phase: string },
        @Req() req: any
    ) {
        return this.workflowService.advanceToPhase(customerId, body.phase, req.user.id);
    }

    // Endpoint to mark installation as complete
    @Post('installation-complete')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.INSTALLATION_TEAM, Role.SUPER_ADMIN, Role.REGION_ADMIN, Role.PLANT_ADMIN, Role.EMPLOYEE)
    markInstallationComplete(@Body() body: { customerId: string }, @Req() req: any) {
        return this.workflowService.markInstallationComplete(body.customerId, req.user.id);
    }

    @Post('assign-team')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.REGION_ADMIN, Role.SUPER_ADMIN)
    assignInstallationTeam(@Body() body: { customerId: string, teamId: string, adminId: string }) {
        return this.workflowService.assignInstallationTeam(body.customerId, body.teamId, body.adminId);
    }

    @Post('request-qc')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.INSTALLATION_TEAM, Role.SUPER_ADMIN, Role.REGION_ADMIN, Role.EMPLOYEE, Role.PLANT_ADMIN)
    requestInstallationQC(@Body() body: { customerId: string }, @Req() req: any) {
        return this.workflowService.requestInstallationQC(body.customerId, req.user.id);
    }

    @Post('approve-qc')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.REGION_ADMIN, Role.SUPER_ADMIN, Role.EMPLOYEE, Role.PLANT_ADMIN)
    approveInstallationQC(@Body() body: { customerId: string }, @Req() req: any) {
        return this.workflowService.approveInstallationQC(body.customerId, req.user.id);
    }

    @Post('reject-qc')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.REGION_ADMIN, Role.SUPER_ADMIN, Role.EMPLOYEE, Role.PLANT_ADMIN)
    rejectInstallationQC(@Body() body: { customerId: string, reason: string }, @Req() req: any) {
        return this.workflowService.rejectInstallationQC(body.customerId, req.user.id, body.reason);
    }

    // Endpoint to reset workflow (clear and reinitialize)
    @Post('reset/:customerId')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN, Role.PLANT_ADMIN, Role.REGION_ADMIN)
    async resetWorkflow(
        @Param('customerId') customerId: string,
        @Req() req: any
    ) {
        return this.workflowService.resetWorkflow(customerId, req.user.id);
    }
}
