import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Warehouse } from './warehouse.entity';

export enum InventoryCategory {
  MODULE = 'MODULE',
  INVERTER = 'INVERTER',
  CABLE = 'CABLE',
  STRUCTURE = 'STRUCTURE',
  BOS = 'BOS',
  OTHER = 'OTHER',
}

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  sku: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: InventoryCategory,
    default: InventoryCategory.OTHER,
  })
  category: InventoryCategory;

  @Column({ type: 'int', default: 0 })
  totalQuantity: number;

  @Column({ type: 'int', default: 0 })
  availableQuantity: number;

  @Column({ nullable: true })
  vendor: string;

  @Column({ nullable: true })
  warrantyMonths: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  unitPrice: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.items)
  @JoinColumn({ name: 'warehouseId' })
  warehouse: Warehouse;

  @Column()
  warehouseId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
