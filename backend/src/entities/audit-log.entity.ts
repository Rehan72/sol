import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    entity: string; // e.g., 'Survey Report', 'Installation Phase'

    @Column()
    entityId: string; // ID of the entity being modified

    @Column()
    action: string; // CREATED, UPDATE, STATUS_CHANGE, LOCKED, COMPLETED

    @Column({ nullable: true })
    phase: string; // SURVEY, INSTALLATION, COMMISSIONING, PLANT

    @Column({ type: 'text', nullable: true })
    oldValue: string;

    @Column({ type: 'text', nullable: true })
    newValue: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column()
    performedById: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'performedById' })
    performedBy: User;

    @CreateDateColumn()
    timestamp: Date;
}
