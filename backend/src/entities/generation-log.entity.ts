import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Plant } from './plant.entity';

@Entity('generation_logs')
export class GenerationLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    plantId: string;

    @ManyToOne(() => Plant)
    @JoinColumn({ name: 'plantId' })
    plant: Plant;

    @Column('decimal', { precision: 10, scale: 2 })
    kwGeneration: number;

    @Column('decimal', { precision: 5, scale: 2 })
    efficiency: number; // 0-100

    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    ambientTemp: number;

    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    moduleTemp: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    irradiance: number; // W/m2

    @CreateDateColumn()
    timestamp: Date;
}
