import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('pricing_rules')
export class PricingRule {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    category: string; // PANEL, INVERTER, STRUCTURE, BOS, INSTALLATION, NET_METERING

    @Column({ nullable: true })
    subCategory: string; // e.g., 'Monocrystalline', 'On-Grid'

    @Column()
    itemName: string; // e.g., '450W Mono PERC'

    @Column()
    unit: string; // WATT, KW, UNIT, SQFT

    @Column({ type: 'float' })
    baseRate: number; // Rate per unit

    @Column({ type: 'float', nullable: true })
    minUnits: number;

    @Column({ type: 'float', nullable: true })
    maxUnits: number;

    @Column({ default: 'NATIONAL' })
    region: string; // NATIONAL or specific STATE

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', nullable: true })
    lastMarketSyncAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
