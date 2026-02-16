import { Body, Controller, Post, Param, UseGuards } from '@nestjs/common';
import { ControlService } from './control.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Device Control')
@ApiBearerAuth()
@Controller('control')
@UseGuards(AccessTokenGuard, RolesGuard)
export class ControlController {
  constructor(private readonly controlService: ControlService) {}

  @Post(':plantId/start')
  @Roles(Role.SUPER_ADMIN, Role.PLANT_ADMIN)
  @ApiOperation({ summary: 'Remote Start Inverter' })
  async startInverter(@Param('plantId') plantId: string) {
    return this.controlService.turnInverterOn(plantId);
  }

  @Post(':plantId/stop')
  @Roles(Role.SUPER_ADMIN, Role.PLANT_ADMIN)
  @ApiOperation({ summary: 'Remote Stop Inverter' })
  async stopInverter(@Param('plantId') plantId: string) {
    return this.controlService.turnInverterOff(plantId);
  }

  @Post(':plantId/power-limit')
  @Roles(Role.SUPER_ADMIN, Role.PLANT_ADMIN)
  @ApiOperation({ summary: 'Set Active Power Limit' })
  async setPowerLimit(@Param('plantId') plantId: string, @Body('limit') limit: number) {
    return this.controlService.setActivePowerLimit(plantId, limit);
  }

  @Post(':plantId/peak-shaving')
  @Roles(Role.SUPER_ADMIN, Role.PLANT_ADMIN)
  @ApiOperation({ summary: 'Toggle Peak Shaving Mode' })
  async togglePeakShaving(@Param('plantId') plantId: string, @Body() body: { enabled: boolean, threshold?: number }) {
    return this.controlService.setPeakShaving(plantId, body.enabled, body.threshold);
  }

  @Post(':plantId/export-limit')
  @Roles(Role.SUPER_ADMIN, Role.PLANT_ADMIN)
  @ApiOperation({ summary: 'Set Grid Export Limit' })
  async setExportLimit(@Param('plantId') plantId: string, @Body('limit') limit: number) {
    return this.controlService.setGridExportLimit(plantId, limit);
  }

  @Post(':plantId/tariff')
  @Roles(Role.SUPER_ADMIN, Role.PLANT_ADMIN)
  @ApiOperation({ summary: 'Set Dynamic Tariff Schedule' })
  async setTariff(@Param('plantId') plantId: string, @Body() tariffData: any) {
    return this.controlService.setDynamicTariff(plantId, tariffData);
  }
}
