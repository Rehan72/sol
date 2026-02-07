import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('plants')
export class Plant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // 1. Plant Identity & Status
    @Column()
    plantName: string;

    @Column({ unique: true })
    plantCode: string;

    @Column({ default: 'grid_connected' })
    plantType: string;

    @Column('decimal', { precision: 10, scale: 2 })
    capacity: number;

    @Column({ default: 'draft' })
    status: string;

    @Column({ nullable: true })
    regionAdminId: string;

    // 2. Location & Grid Info
    @Column()
    location: string;

    @Column('decimal', { precision: 10, scale: 6 })
    latitude: number;

    @Column('decimal', { precision: 10, scale: 6 })
    longitude: number;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    utilityName: string;

    @Column({ nullable: true })
    gridVoltage: string;

    @Column({ default: 'yes' })
    netMetering: string;

    @Column({ type: 'date', nullable: true })
    connectionDate: Date;

    // 3. Electrical Configuration
    @Column({ default: 'string' })
    inverterType: string;

    @Column({ nullable: true })
    inverterMake: string;

    @Column({ nullable: true })
    inverterCount: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    inverterRatedPower: number;

    @Column({ default: 'no' })
    transformerPresent: string;

    @Column({ nullable: true })
    transformerRating: string;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    transformerCapacity: number;

    // 4. Metering & Sensors
    @Column({ default: 'bi_directional' })
    meterType: string;

    @Column({ nullable: true })
    meterMake: string;

    @Column({ default: 'modbus_rtu' })
    meterProtocol: string;

    @Column({ default: false })
    solarIrradiance: boolean;

    @Column({ default: false })
    ambientTemp: boolean;

    @Column({ default: false })
    moduleTemp: boolean;

    // 5. Connectivity
    @Column({ default: 'modbus_tcp' })
    dataProtocol: string;

    @Column({ nullable: true })
    loggerId: string;

    @Column({ default: '4g' })
    internetType: string;

    @Column({ default: '15' })
    dataPushInterval: string;

    // 6. Control & Safety
    @Column({ default: true })
    antiIslanding: boolean;

    @Column({ default: true })
    protectionEnabled: boolean;

    @Column({ default: 'no' })
    curtailmentAllowed: string;

    // 7. Owner/Access Info
    @Column()
    ownerName: string;

    @Column()
    ownerPhone: string;

    @Column({ nullable: true })
    ownerEmail: string;

    // Optional: For tracking plant image
    @Column({ nullable: true })
    image: string;

    // Optional: For tracking generation and efficiency
    @Column('decimal', { precision: 10, scale: 2, nullable: true, default: 0 })
    generation: number;

    @Column('decimal', { precision: 5, scale: 2, nullable: true, default: 0 })
    efficiency: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
