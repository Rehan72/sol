import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InventoryItem, InventoryCategory } from '../entities/inventory-item.entity';
import { Warehouse } from '../entities/warehouse.entity';
import { StockTransaction, TransactionType } from '../entities/stock-transaction.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly itemRepo: Repository<InventoryItem>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
    @InjectRepository(StockTransaction)
    private readonly transactionRepo: Repository<StockTransaction>,
    private dataSource: DataSource,
  ) {}

  // Warehouse Management
  async createWarehouse(name: string, location: string, contactPerson?: string) {
    const warehouse = this.warehouseRepo.create({ name, location, contactPerson });
    return this.warehouseRepo.save(warehouse);
  }

  async getWarehouses() {
    return this.warehouseRepo.find({ relations: ['items'] });
  }

  // Inventory Item Management
  async createItem(data: Partial<InventoryItem>) {
    const item = this.itemRepo.create(data);
    return this.itemRepo.save(item);
  }

  async getInventory(warehouseId?: string) {
    const where = warehouseId ? { warehouseId } : {};
    return this.itemRepo.find({ where, relations: ['warehouse'] });
  }

  // Stock Movements
  async updateStock(
    itemId: string,
    quantity: number,
    type: TransactionType,
    userId: string,
    notes?: string,
    referenceId?: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const item = await queryRunner.manager.findOne(InventoryItem, { where: { id: itemId } });
      if (!item) throw new NotFoundException('Inventory item not found');

      if (type === TransactionType.STOCK_OUT && item.availableQuantity < quantity) {
        throw new BadRequestException(`Insufficient stock for ${item.name}. Available: ${item.availableQuantity}`);
      }

      // Update quantities
      if (type === TransactionType.STOCK_IN) {
        item.totalQuantity += quantity;
        item.availableQuantity += quantity;
      } else if (type === TransactionType.STOCK_OUT) {
        item.availableQuantity -= quantity;
      } else if (type === TransactionType.ADJUSTMENT) {
        // Adjust available quantity (could be positive or negative)
        item.availableQuantity += quantity;
      }

      await queryRunner.manager.save(item);

      // Log transaction
      const transaction = this.transactionRepo.create({
        itemId,
        type,
        quantity,
        performedById: userId,
        notes,
        referenceId,
      });
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
      return item;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getTransactions(itemId?: string) {
    const where = itemId ? { itemId } : {};
    return this.transactionRepo.find({
      where,
      relations: ['item', 'performedBy'],
      order: { createdAt: 'DESC' },
    });
  }
}
