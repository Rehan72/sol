import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('workflow_steps')
export class WorkflowStep {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    phase: string; // SURVEY, INSTALLATION, COMMISSIONING

    @Column() // e.g., 'mounting', 'inverter'
    stepId: string;

    @Column()
    label: string;

    @Column({ default: 'pending' })
    status: string; // pending, in_progress, completed, locked

    @Column({ nullable: true })
    customerId: string; // Links to the Customer (User)

    @ManyToOne(() => User)
    @JoinColumn({ name: 'customerId' })
    customer: User;

    @Column({ nullable: true })
    assignedToId: string; // User ID (Worker)

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'assignedToId' })
    assignedTo: User;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: any; // For photos, extra data

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
