import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { InventoryItem } from './inventory-item.entity';
import { User } from './user.entity';

export enum TransactionType {
  STOCK_IN = 'STOCK_IN',
  STOCK_OUT = 'STOCK_OUT',
  ADJUSTMENT = 'ADJUSTMENT',
  TRANSFER = 'TRANSFER',
}

@Entity('stock_transactions')
export class StockTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => InventoryItem)
  @JoinColumn({ name: 'itemId' })
  item: InventoryItem;

  @Column()
  itemId: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ nullable: true })
  referenceId: string; // e.g., Order ID, Ticket ID, Installation Phase ID

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'performedById' })
  performedBy: User;

  @Column()
  performedById: string;

  @CreateDateColumn()
  createdAt: Date;
}
