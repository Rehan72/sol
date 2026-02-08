import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Quotation } from './quotation.entity';
import { User } from './user.entity';

@Entity('quotation_approvals')
export class QuotationApproval {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int' })
    quotationId: number;

    @ManyToOne(() => Quotation)
    @JoinColumn({ name: 'quotationId' })
    quotation: Quotation;

    @Column()
    action: string; // SUBMITTED, APPROVED, REJECTED, FINAL_APPROVED

    @Column({ type: 'uuid', nullable: true })
    actionById: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'actionById' })
    actionBy: User;

    @Column({ nullable: true })
    role: string; // Role of the user at the time of action

    @Column({ type: 'text', nullable: true })
    remarks: string;

    @CreateDateColumn()
    timestamp: Date;
}
