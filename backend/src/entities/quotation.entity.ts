import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Survey } from './survey.entity';

@Entity('quotations')
export class Quotation {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ unique: true })
    quotationNumber: string;

    @Column({ type: 'int', nullable: true })
    surveyId: number;

    @OneToOne(() => Survey, { nullable: true })
    @JoinColumn({ name: 'surveyId' })
    survey: Survey;

    @Column({ nullable: true })
    validityDate: Date;

    // B. System Configuration
    @Column({ type: 'float' })
    proposedSystemCapacity: number; // kW

    @Column({ default: 'Grid-connected' })
    plantType: string;

    @Column({ nullable: true })
    numberOfPanels: number;

    @Column({ nullable: true })
    panelWattage: number; // Wp

    @Column({ nullable: true })
    panelBrand: string;

    @Column({ nullable: true })
    inverterBrand: string;

    @Column({ nullable: true })
    inverterType: string;

    @Column({ nullable: true })
    mountingStructureType: string;

    // C. Energy Generation Estimation
    @Column({ type: 'float', nullable: true })
    annualEnergyGeneration: number; // kWh

    @Column({ type: 'float', nullable: true })
    monthlyAverageGeneration: number;

    @Column({ type: 'float', nullable: true })
    cuf: number; // %

    @Column({ type: 'float', nullable: true })
    performanceRatio: number; // %

    // D. Financial Breakdown
    @Column({ type: 'float', nullable: true })
    costSolarModules: number;

    @Column({ type: 'float', nullable: true })
    costInverters: number;

    @Column({ type: 'float', nullable: true })
    costStructure: number;

    @Column({ type: 'float', nullable: true })
    costBOS: number;

    @Column({ type: 'float', nullable: true })
    costInstallation: number;

    @Column({ type: 'float', nullable: true })
    costNetMetering: number;

    @Column({ type: 'float' })
    totalProjectCost: number;

    // E. Subsidy & Incentives
    @Column({ type: 'float', nullable: true })
    governmentSubsidy: number;

    @Column({ type: 'float', nullable: true })
    netProjectCost: number;

    // F. Savings & ROI Analysis
    @Column({ type: 'float', nullable: true })
    annualElectricitySavings: number;

    @Column({ type: 'float', nullable: true })
    electricityTariff: number;

    @Column({ type: 'float', nullable: true })
    paybackPeriod: number; // Years

    @Column({ type: 'float', nullable: true })
    savings25Years: number;

    @Column({ type: 'float', nullable: true })
    irr: number; // %

    // G. O&M
    @Column({ type: 'int', nullable: true })
    warrantyPanelsYears: number;

    @Column({ type: 'int', nullable: true })
    warrantyInverterYears: number;

    // H. Status & Workflow
    @Column({
        type: 'enum',
        enum: ['DRAFT', 'SUBMITTED', 'PLANT_APPROVED', 'REGION_APPROVED', 'REJECTED', 'FINAL_APPROVED'],
        default: 'DRAFT'
    })
    status: string;

    @Column({ nullable: true })
    currentApproverRole: string; // PLANT_ADMIN, REGION_ADMIN, SUPER_ADMIN

    @Column({ type: 'jsonb', nullable: true })
    paymentStatus: {
        solarModules?: string;
        inverters?: string;
        structure?: string;
        bos?: string;
        installation?: string;
    }; // Track payment status per item: PAID, DUE, PENDING

    @Column({ type: 'float', nullable: true })
    roi: number; // Return on Investment %

    @ManyToOne('User')
    @JoinColumn({ name: 'createdById' })
    createdBy: any;

    @Column({ type: 'int', default: 1 })
    version: number;

    @Column({ nullable: true })
    ticketId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
