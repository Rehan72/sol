import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from '../entities/ticket.entity';
import { ServiceReport } from '../entities/service-report.entity';
import { Quotation } from '../entities/quotation.entity';
import { Team } from '../entities/team.entity';
import { User } from '../entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Ticket, ServiceReport, Quotation, Team, User]),
    ],
    controllers: [TicketsController],
    providers: [TicketsService],
    exports: [TicketsService],
})
export class TicketsModule { }
