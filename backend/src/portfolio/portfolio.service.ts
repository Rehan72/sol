import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plant } from '../entities/plant.entity';
import { User } from '../entities/user.entity';
import { Quotation } from '../entities/quotation.entity';
import { Ticket } from '../entities/ticket.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class PortfolioService {
    constructor(
        @InjectRepository(Plant)
        private plantRepo: Repository<Plant>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Quotation)
        private quotationRepo: Repository<Quotation>,
        @InjectRepository(Ticket)
        private ticketRepo: Repository<Ticket>,
    ) {}

    async getAggregatedStats() {
        const [plants, customers, tickets, quotations] = await Promise.all([
            this.plantRepo.count(),
            this.userRepo.count({ where: { role: Role.CUSTOMER } }),
            this.ticketRepo.count({ where: { status: 'OPEN' } }),
            this.quotationRepo.find({
                where: { status: 'FINAL_APPROVED' },
                select: ['totalProjectCost', 'proposedSystemCapacity']
            })
        ]);

        const totalCapacity = quotations.reduce((sum, q) => sum + (q.proposedSystemCapacity || 0), 0);
        const totalRevenue = quotations.reduce((sum, q) => sum + (q.totalProjectCost || 0), 0);
        const totalGenerationEst = totalCapacity * 4.5 * 365; // Approx 4.5 kWh/kW/day

        return {
            totalPlants: plants,
            totalCustomers: customers,
            activeIssues: tickets,
            totalCapacityKw: Math.round(totalCapacity),
            totalRevenue: Math.round(totalRevenue),
            estimatedDailyGeneration: Math.round(totalCapacity * 4.5),
            estimatedAnnualGeneration: Math.round(totalGenerationEst),
            carbonOffsetMetricTons: parseFloat(((totalGenerationEst * 0.82) / 1000).toFixed(2))
        };
    }

    async getPlantWisePerformance() {
        const plants = await this.plantRepo.find();
        const performance = await Promise.all(plants.map(async (plant) => {
            const customerCount = await this.userRepo
                .createQueryBuilder('user')
                .where("user.role = :role", { role: Role.CUSTOMER })
                .andWhere("user.plant @> :plantCriteria", { plantCriteria: JSON.stringify({ id: plant.id }) })
                .getCount();

            const activeTickets = await this.ticketRepo
                .createQueryBuilder('ticket')
                .where("ticket.status = :status", { status: 'OPEN' })
                .andWhere("ticket.plant @> :plantCriteria", { plantCriteria: JSON.stringify({ id: plant.id }) })
                .getCount();
            
            return {
                id: plant.id,
                name: plant.plantName,
                location: plant.location,
                customers: customerCount,
                activeTickets: activeTickets,
                status: plant.status || 'OPERATIONAL',
                healthScore: 100 - (activeTickets * 5)
            };
        }));
        
        return performance;
    }
}
