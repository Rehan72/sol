import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';

@Entity('cost_estimations')
export class CostEstimation {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ unique: true })
    estimationNumber: string;

    @Column()
    projectName: string;

    @Column({ type: 'float', default: 0 })
    systemCapacity: number; // kW

    @Column({ default: 'Grid-connected Rooftop' })
    plantType: string;

    @Column({
        type: 'enum',
        enum: ['DRAFT', 'FINALIZED'],
        default: 'DRAFT'
    })
    status: string;

    // ─── STAGE 1: Design & Pre-Installation ───
    @Column({ type: 'jsonb', default: [] })
    stageDesign: {
        item: string;
        qty: number;
        unit: string;
        rate: number;
        amount: number;
    }[];

    // ─── STAGE 2: Mounting Structure ───
    @Column({ type: 'jsonb', default: [] })
    stageMounting: {
        item: string;
        qty: number;
        unit: string;
        rate: number;
        amount: number;
    }[];

    // ─── STAGE 3: Solar Panels ───
    @Column({ type: 'jsonb', default: [] })
    stagePanels: {
        item: string;
        qty: number;
        unit: string;
        rate: number;
        amount: number;
    }[];

    // ─── STAGE 4: DC Side Electrical ───
    @Column({ type: 'jsonb', default: [] })
    stageDcElectrical: {
        item: string;
        qty: number;
        unit: string;
        rate: number;
        amount: number;
    }[];

    // ─── STAGE 5: Inverter Installation ───
    @Column({ type: 'jsonb', default: [] })
    stageInverter: {
        item: string;
        qty: number;
        unit: string;
        rate: number;
        amount: number;
    }[];

    // ─── STAGE 6: Grid Connection ───
    @Column({ type: 'jsonb', default: [] })
    stageGridConnection: {
        item: string;
        qty: number;
        unit: string;
        rate: number;
        amount: number;
    }[];

    // ─── STAGE 7: Earthing & Safety ───
    @Column({ type: 'jsonb', default: [] })
    stageEarthing: {
        item: string;
        qty: number;
        unit: string;
        rate: number;
        amount: number;
    }[];

    // ─── STAGE 8: Monitoring System ───
    @Column({ type: 'jsonb', default: [] })
    stageMonitoring: {
        item: string;
        qty: number;
        unit: string;
        rate: number;
        amount: number;
    }[];

    // ─── STAGE 9: Labour & Commissioning ───
    @Column({ type: 'jsonb', default: [] })
    stageLabour: {
        item: string;
        qty: number;
        unit: string;
        rate: number;
        amount: number;
    }[];

    // ─── Summary ───
    @Column({ type: 'float', default: 0 })
    subtotal: number;

    @Column({ type: 'float', default: 3 })
    contingencyPercent: number;

    @Column({ type: 'float', default: 0 })
    contingencyAmount: number;

    @Column({ type: 'float', default: 18 })
    gstPercent: number;

    @Column({ type: 'float', default: 0 })
    gstAmount: number;

    @Column({ type: 'float', default: 0 })
    totalProjectCost: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'int', nullable: true })
    quotationId: number;

    @OneToOne('Quotation', (quotation: any) => quotation.costEstimation)
    @JoinColumn({ name: 'quotationId' })
    quotation: any;

    // ─── Relations ───
    @Column({ type: 'int', nullable: true })
    createdById: number;

    @ManyToOne('User')
    @JoinColumn({ name: 'createdById' })
    createdBy: any;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
