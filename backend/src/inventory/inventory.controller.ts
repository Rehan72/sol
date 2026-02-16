import { Controller, Get, Post, Put, Body, Query, UseGuards, Req } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { TransactionType } from '../entities/stock-transaction.entity';

@Controller('inventory')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('warehouses')
  @Roles(Role.SUPER_ADMIN, Role.REGION_ADMIN)
  async createWarehouse(@Body() data: { name: string; location: string; contactPerson?: string }) {
    return this.inventoryService.createWarehouse(data.name, data.location, data.contactPerson);
  }

  @Get('warehouses')
  async getWarehouses() {
    return this.inventoryService.getWarehouses();
  }

  @Post('items')
  @Roles(Role.SUPER_ADMIN, Role.REGION_ADMIN)
  async createItem(@Body() data: any) {
    return this.inventoryService.createItem(data);
  }

  @Get('items')
  async getInventory(@Query('warehouseId') warehouseId?: string) {
    return this.inventoryService.getInventory(warehouseId);
  }

  @Post('update-stock')
  @Roles(Role.SUPER_ADMIN, Role.REGION_ADMIN, Role.PLANT_ADMIN)
  async updateStock(
    @Req() req,
    @Body() data: {
      itemId: string;
      quantity: number;
      type: TransactionType;
      notes?: string;
      referenceId?: string;
    },
  ) {
    return this.inventoryService.updateStock(
      data.itemId,
      data.quantity,
      data.type,
      req.user.id,
      data.notes,
      data.referenceId,
    );
  }

  @Get('transactions')
  async getTransactions(@Query('itemId') itemId?: string) {
    return this.inventoryService.getTransactions(itemId);
  }
}
