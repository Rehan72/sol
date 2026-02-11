import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity('service_reports')
export class ServiceReport {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    ticketId: string;

    @OneToOne(() => Ticket, (ticket) => ticket.report)
    @JoinColumn({ name: 'ticketId' })
    ticket: Ticket;

    @Column({ type: 'text' })
    summary: string;

    @Column({ default: false })
    defectFound: boolean;

    @Column({ type: 'jsonb', nullable: true })
    attachments: string[];

    @Column({ type: 'text', nullable: true })
    findings: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
