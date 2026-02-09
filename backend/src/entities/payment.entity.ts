import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    razorpayOrderId: string;

    @Column({ nullable: true })
    razorpayPaymentId: string;

    @Column({ nullable: true })
    razorpaySignature: string;

    @Column()
    milestoneId: string;

    @Column({ type: 'float' })
    amount: number;

    @Column({ default: 'INR' })
    currency: string;

    @Column({ default: 'COMPLETED' })
    status: string; // PENDING, COMPLETED, FAILED

    @Column()
    customerId: string;

    @Column({ nullable: true })
    plantAdminId: string;

    @Column({ nullable: true })
    plantId: string;

    @Column({ nullable: true })
    quotationId: number;

    @Column({ default: false })
    isMock: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
