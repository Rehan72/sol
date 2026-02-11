import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AssignTeamDto } from './dto/assign-team.dto';
import { UploadReportDto } from './dto/upload-report.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('tickets')
@Controller('tickets')
@UseGuards(AccessTokenGuard, RolesGuard)
@ApiBearerAuth()
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    @Roles(Role.CUSTOMER)
    @ApiOperation({ summary: 'Create a new service ticket (Customer only)' })
    create(@Body() createTicketDto: CreateTicketDto, @Request() req) {
        return this.ticketsService.create(createTicketDto, req.user);
    }

    @Get()
    @ApiOperation({ summary: 'Get all tickets based on role' })
    findAll(@Request() req) {
        return this.ticketsService.findAll(req.user);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get ticket details' })
    findOne(@Param('id') id: string) {
        return this.ticketsService.findOne(id);
    }

    @Patch(':id/assign')
    @Roles(Role.PLANT_ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Assign maintenance team to ticket' })
    assignTeam(@Param('id') id: string, @Body() assignTeamDto: AssignTeamDto) {
        return this.ticketsService.assignTeam(id, assignTeamDto);
    }

    @Post(':id/report')
    @Roles(Role.PLANT_ADMIN, Role.SUPER_ADMIN, Role.EMPLOYEE)
    @ApiOperation({ summary: 'Upload site visit report' })
    uploadReport(@Param('id') id: string, @Body() uploadReportDto: UploadReportDto) {
        return this.ticketsService.uploadReport(id, uploadReportDto);
    }

    @Patch(':id/complete')
    @Roles(Role.PLANT_ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Mark maintenance as completed' })
    complete(@Param('id') id: string) {
        return this.ticketsService.complete(id);
    }
}
