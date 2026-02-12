import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('surveys')
export class Survey {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'uuid', nullable: true })
    surveyorId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'surveyorId' })
    surveyor: User;

    @Column({ nullable: true })
    customerName: string;

    @Column({ nullable: true })
    customerPhone: string;

    @Column({ nullable: true })
    customerId: string;

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

    // ─── 1. ENERGY & LOAD DETAILS ───
    @Column({ type: 'float', nullable: true })
    averageMonthlyConsumption: number; // kWh

    @Column({ type: 'float', nullable: true })
    daytimeConsumptionPercentage: number; // %

    @Column({ type: 'float', nullable: true })
    sanctionedLoad: number; // kW / kVA

    @Column({ nullable: true })
    connectionType: string; // LT / HT

    @Column({ nullable: true })
    discomName: string;

    @Column({ type: 'text', nullable: true })
    futureLoadExpansionPlan: string;

    @Column({ type: 'boolean', nullable: true })
    dieselGeneratorAvailable: boolean;

    @Column({ nullable: true })
    dieselGeneratorCapacity: string;

    // ─── 2. ROOF / LAND DETAILS ───
    @Column({ nullable: true })
    siteType: string; // Rooftop / Ground / Carport

    @Column({ nullable: true })
    roofType: string; // RCC / Metal / Tile / Asbestos

    @Column({ type: 'float', nullable: true })
    roofArea: number; // sq.m

    @Column({ type: 'float', nullable: true })
    shadowFreeUsableArea: number; // sq.m

    @Column({ nullable: true })
    roofOrientation: string; // North / South / East / West

    @Column({ type: 'float', nullable: true })
    tiltAngle: number;

    @Column({ nullable: true })
    roofCondition: string; // Good, Repair Required

    @Column({ type: 'float', nullable: true })
    parapetHeight: number; // meters

    @Column({ type: 'text', nullable: true })
    obstructions: string; // water tank, AC units, etc.

    @Column({ type: 'boolean', nullable: true })
    structuralStabilityCertificateRequired: boolean;

    // ─── 3. SHADING & ENVIRONMENTAL CONDITIONS ───
    @Column({ type: 'float', nullable: true })
    nearbyBuildingHeight: number; // meters

    @Column({ type: 'text', nullable: true })
    treeShading: string;

    @Column({ nullable: true })
    shadowTiming: string; // Morning / Evening

    @Column({ type: 'text', nullable: true })
    seasonalShading: string;

    @Column({ nullable: true })
    dustLevel: string; // Low / Medium / High (Industrial)

    @Column({ nullable: true })
    windZone: string;

    @Column({ type: 'boolean', nullable: true })
    coastalArea: boolean; // Corrosion risk

    // ─── 4. ELECTRICAL INFRASTRUCTURE ───
    @Column({ nullable: true })
    mainDBLocation: string;

    @Column({ type: 'float', nullable: true })
    distanceRoofToDB: number; // meters

    @Column({ type: 'boolean', nullable: true })
    earthingAvailable: boolean;

    @Column({ type: 'boolean', nullable: true })
    lightningArresterAvailable: boolean;

    @Column({ type: 'boolean', nullable: true })
    netMeteringFeasibility: boolean;

    @Column({ nullable: true })
    transformerCapacity: string; // if HT

    @Column({ type: 'boolean', nullable: true })
    panelRoomSpace: boolean;

    @Column({ type: 'float', nullable: true })
    cableRouteLength: number; // meters

    // ─── 5. FINANCIAL & APPROVAL DETAILS ───
    @Column({ nullable: true })
    customerType: string; // Residential / Commercial / Industrial / Utility

    @Column({ type: 'boolean', nullable: true })
    subsidyEligibility: boolean;

    @Column({ type: 'boolean', nullable: true })
    gstApplicable: boolean;

    @Column({ type: 'boolean', nullable: true })
    acceleratedDepreciation: boolean; // Commercial

    @Column({ nullable: true })
    discomApprovalTimeline: string;

    @Column({ nullable: true })
    paymentPreference: string; // Milestone-based

    // ─── 6. MANDATORY SITE DOCUMENTS (Photo Uploads) ───
    @Column({ type: 'jsonb', nullable: true })
    roofPhotos: string[]; // wide angle

    @Column({ type: 'jsonb', nullable: true })
    shadowPhotos: string[];

    @Column({ type: 'jsonb', nullable: true })
    mainDBPhoto: string[];

    @Column({ type: 'jsonb', nullable: true })
    meterPhoto: string[];

    @Column({ type: 'jsonb', nullable: true })
    electricityBillCopy: string[];

    @Column({ type: 'jsonb', nullable: true })
    structureConditionPhotos: string[];

    // ─── SURVEY CONCLUSIONS ───
    @Column({ type: 'float', nullable: true })
    recommendedSystemSize: number; // kW

    @Column({ type: 'text', nullable: true })
    installationChallenges: string;

    @Column({ type: 'text', nullable: true })
    specialNotes: string;

    @Column({ default: 'DRAFT' })
    status: string; // DRAFT / IN_PROGRESS / COMPLETED / APPROVED / REJECTED

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
