import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('surveys')
export class Survey {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'uuid' })
    surveyorId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'surveyorId' })
    surveyor: User;

    @Column({ nullable: true })
    customerName: string;

    @Column({ nullable: true })
    customerPhone: string;

    @Column({ nullable: true })
    customerEmail: string;

    @Column({ nullable: true })
    siteAddress: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    pincode: string;

    @Column({ nullable: true })
    customerType: string; // Residential / Commercial / Industrial / Utility

    @Column({ nullable: true })
    electricityConsumerNumber: string;

    @Column({ nullable: true })
    discomName: string;

    // B. Site Location & Roof Details
    @Column({ nullable: true })
    siteType: string; // Rooftop / Ground Mounted / Carport

    @Column({ nullable: true })
    roofType: string; // RCC / Metal / Asbestos / Tile

    @Column({ nullable: true })
    roofOrientation: string; // Azimuth

    @Column({ type: 'float', nullable: true })
    roofTiltAngle: number;

    @Column({ type: 'float', nullable: true })
    availableShadowFreeArea: number; // sq.m

    @Column({ nullable: true })
    roofCondition: string; // Good / Repair Required

    @Column({ nullable: true })
    roofOwnership: string; // Owned / Leased

    // C. Shading & Obstruction Analysis
    @Column({ nullable: true })
    shadingPresence: string; // None / Partial / Heavy

    @Column({ nullable: true })
    shadingSource: string; // Trees / Buildings / Water Tank / Towers

    @Column({ nullable: true })
    shadowTiming: string; // Morning / Noon / Evening

    @Column({ type: 'boolean', nullable: true })
    seasonalShadingImpact: boolean;

    @Column({ type: 'jsonb', nullable: true })
    photoUrls: string[]; // Multiple Photo Uploads

    // D. Electrical Infrastructure Details
    @Column({ type: 'float', nullable: true })
    existingSanctionLoad: number; // kW

    @Column({ type: 'float', nullable: true })
    contractDemand: number; // kVA

    @Column({ nullable: true })
    existingTransformerCapacity: string;

    @Column({ nullable: true })
    connectionType: string; // LT / HT

    @Column({ nullable: true })
    mainDistributionBoardLocation: string;

    @Column({ type: 'boolean', nullable: true })
    earthingAvailability: boolean;

    @Column({ type: 'boolean', nullable: true })
    lightningArrestorAvailable: boolean;

    // E. Energy Consumption Details
    @Column({ type: 'float', nullable: true })
    averageMonthlyUnits: number; // kWh

    @Column({ nullable: true })
    last12MonthsBillUrl: string; // Upload

    @Column({ nullable: true })
    peakLoadTiming: string;

    @Column({ type: 'float', nullable: true })
    daytimeLoadPercentage: number;

    @Column({ type: 'boolean', nullable: true })
    dieselGeneratorAvailable: boolean;

    @Column({ nullable: true })
    dieselGeneratorCapacity: string;

    // F. Safety & Compliance
    @Column({ type: 'boolean', nullable: true })
    fireSafetyClearanceRequired: boolean;

    @Column({ type: 'boolean', nullable: true })
    structuralStabilityCertificateRequired: boolean;

    @Column({ type: 'boolean', nullable: true })
    netMeteringAllowed: boolean;

    @Column({ type: 'boolean', nullable: true })
    discomTechnicalApprovalRequired: boolean;

    // G. Surveyor Observations
    @Column({ type: 'text', nullable: true })
    installationChallenges: string;

    @Column({ type: 'text', nullable: true })
    specialNotes: string;

    @Column({ type: 'float', nullable: true })
    recommendedSystemSize: number; // kW

    @Column({ default: 'DRAFT' })
    status: string; // DRAFT / IN_PROGRESS / COMPLETED / APPROVED / REJECTED

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
