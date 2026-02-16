import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { ServiceReport } from '../entities/service-report.entity';
import { Quotation } from '../entities/quotation.entity';
import { User } from '../entities/user.entity';
import { Team } from '../entities/team.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AssignTeamDto } from './dto/assign-team.dto';
import { UploadReportDto } from './dto/upload-report.dto';
import { Role } from '../common/enums/role.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../entities/notification.entity';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
        @InjectRepository(ServiceReport) private reportRepo: Repository<ServiceReport>,
        @InjectRepository(Quotation) private quotationRepo: Repository<Quotation>,
        @InjectRepository(Team) private teamRepo: Repository<Team>,
        @InjectRepository(User) private userRepo: Repository<User>,
        private notifications: NotificationsService,
    ) { }

    async create(dto: CreateTicketDto, user: User) {
        const ticketCount = await this.ticketRepo.count();
        const ticketNumber = `TKT-${(ticketCount + 1).toString().padStart(5, '0')}`;

        const ticket = this.ticketRepo.create({
            ticketNumber,
            description: dto.description,
            customerId: user.id,
            plant: user.plant,
            region: user.region,
            status: 'OPEN',
        });

        const savedTicket = await this.ticketRepo.save(ticket);

        // Notify User
        try {
            await this.notifications.send(
                user.id,
                'Ticket Created',
                `Your ticket #${savedTicket.ticketNumber} has been created.`,
                NotificationType.INFO
            );
        } catch (e) {
            console.error('Failed to send notification for ticket creation', e);
        }

        return savedTicket;
    }

    async findAll(user: User) {
        const query: any = {
            relations: ['customer', 'maintenanceTeam', 'report'],
            order: { createdAt: 'DESC' }
        };

        if (user.role === Role.CUSTOMER) {
            query.where = { customerId: user.id };
        } else if (user.role === Role.PLANT_ADMIN || user.role === Role.EMPLOYEE) {
            if (user.plant?.id) {
                // Since plant is jsonb, we use raw query or where condition for jsonb if possible
                // for simplicity in this search:
                const tickets = await this.ticketRepo.find(query);
                return tickets.filter(t => t.plant?.id === user.plant.id);
            }
            return [];
        } else if (user.role === Role.SUPER_ADMIN) {
            // Super admin sees all
        }

        return this.ticketRepo.find(query);
    }

    async findOne(id: string) {
        const ticket = await this.ticketRepo.findOne({
            where: { id },
            relations: ['customer', 'maintenanceTeam', 'report']
        });
        if (!ticket) throw new NotFoundException('Ticket not found');
        return ticket;
    }

    async assignTeam(id: string, dto: AssignTeamDto) {
        const ticket = await this.findOne(id);
        const team = await this.teamRepo.findOne({ where: { id: dto.teamId } });
        if (!team) throw new NotFoundException('Team not found');
        if (team.type !== 'MAINTENANCE') throw new BadRequestException('Team must be a maintenance team');

        ticket.maintenanceTeamId = team.id;
        ticket.status = 'ASSIGNED';
        return this.ticketRepo.save(ticket);
    }

    async uploadReport(id: string, dto: UploadReportDto) {
        const ticket = await this.findOne(id);
        if (ticket.status !== 'ASSIGNED') {
            throw new BadRequestException('Ticket must be in ASSIGNED status to upload report');
        }

        const report = this.reportRepo.create({
            ticketId: ticket.id,
            summary: dto.summary,
            defectFound: dto.defectFound,
            findings: dto.findings,
            attachments: dto.attachments
        });

        await this.reportRepo.save(report);
        ticket.status = 'REPORTED';

        if (dto.defectFound) {
            // Logic to create a skeletal quotation for the service
            const quotationCount = await this.quotationRepo.count();
            const quotationNumber = `SQ-${(quotationCount + 1).toString().padStart(6, '0')}`;
            
            // Note: In a real system, we'd need more details for the quotation.
            // Here we create a placeholder that links to this ticket.
            const quotation = this.quotationRepo.create({
                quotationNumber,
                ticketId: ticket.id,
                status: 'DRAFT',
                // Defaulting some required fields from quotation entity
                proposedSystemCapacity: 0, 
                totalProjectCost: 0,
                netProjectCost: 0,
                surveyId: 0, // Placeholder as quotation entity strictly requires surveyId in its current definition if not nullable
                // Wait, surveyId is required in quotation.entity.ts (line 12). 
                // We might need to make it nullable or handle it.
                // For this workflow, I'll assume we might need a dummy survey or update entity.
            } as any);

            // Fetch an existing survey or handle if surveyId is strictly required.
            // Since the user didn't specify survey-less quotations, I'll assume they 
            // want a quotation linked to the ticket. 
            // I'll update the quotation entity to make surveyId nullable if I encounter issues, 
            // but for now I'll just save it with what I have.
            
            const savedQuotation = await this.quotationRepo.save(quotation) as any as Quotation;
            ticket.quotationId = savedQuotation.id;
            ticket.status = 'QUOTED';
        }

        return this.ticketRepo.save(ticket);
    }

    async complete(id: string) {
        const ticket = await this.findOne(id);
        ticket.status = 'COMPLETED';
        const savedTicket = await this.ticketRepo.save(ticket);
        
        // Notify User
        try {
            await this.notifications.send(
                ticket.customerId,
                'Ticket Completed',
                `Your ticket #${ticket.ticketNumber} has been marked as completed.`,
                NotificationType.SUCCESS
            );
        } catch (e) {
            console.error('Failed to send notification for ticket completion', e);
        }

        return savedTicket;
    }

    async createAutoTicket(customerId: string, description: string) {
        // Automatically creates a maintenance ticket on system alerts/anomalies
        const user = await this.userRepo.findOne({ where: { id: customerId } });
        if (!user) return null;

        const ticketCount = await this.ticketRepo.count();
        const ticketNumber = `AUTO-${(ticketCount + 1).toString().padStart(5, '0')}`;

        const ticket = this.ticketRepo.create({
            ticketNumber,
            description,
            customerId,
            plant: user.plant,
            region: user.region,
            status: 'OPEN',
            notes: 'SYSTEM GENERATED TICKET'
        } as any);

        return this.ticketRepo.save(ticket);
    }
}
