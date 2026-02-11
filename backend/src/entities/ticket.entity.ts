import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Team } from './team.entity';
import { ServiceReport } from './service-report.entity';

@Entity('tickets')
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    ticketNumber: string;

    @Column()
    description: string;

    @Column({
        type: 'enum',
        enum: ['OPEN', 'ASSIGNED', 'REPORTED', 'QUOTED', 'PAID', 'COMPLETED'],
        default: 'OPEN'
    })
    status: string;

    @Column({ nullable: true })
    customerId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'customerId' })
    customer: User;

    @Column({ type: 'jsonb', nullable: true })
    plant: { id: string };

    @Column({ type: 'jsonb', nullable: true })
    region: { id: string };

    @Column({ nullable: true })
    maintenanceTeamId: string;

    @ManyToOne(() => Team, { nullable: true })
    @JoinColumn({ name: 'maintenanceTeamId' })
    maintenanceTeam: Team;

    @OneToOne(() => ServiceReport, (report) => report.ticket, { nullable: true })
    report: ServiceReport;

    @Column({ nullable: true })
    quotationId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
