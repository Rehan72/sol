import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { Warehouse } from '../entities/warehouse.entity';
import { InventoryItem } from '../entities/inventory-item.entity';
import { StockTransaction } from '../entities/stock-transaction.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Warehouse, InventoryItem, StockTransaction])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
