import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IotGatewayService } from '../iot/iot-gateway.service';

@Injectable()
export class ControlService {
  private readonly logger = new Logger(ControlService.name);
  private peakShavingStates = new Map<string, { enabled: boolean, threshold: number }>();

  constructor(private readonly iotGateway: IotGatewayService) {}

  async turnInverterOn(plantId: string) {
    this.logger.log(`Turning ON inverter for plant ${plantId}`);
    this.iotGateway.publishCommand(plantId, 'SET_POWER_STATE', { state: 'ON' });
    return { success: true, message: 'Inverter start command sent' };
  }

  async turnInverterOff(plantId: string) {
    this.logger.log(`Turning OFF inverter for plant ${plantId}`);
    this.iotGateway.publishCommand(plantId, 'SET_POWER_STATE', { state: 'OFF' });
    return { success: true, message: 'Inverter stop command sent' };
  }

  async setActivePowerLimit(plantId: string, limitKw: number) {
    this.logger.log(`Setting active power limit for ${plantId} to ${limitKw}kW`);
    this.iotGateway.publishCommand(plantId, 'SET_ACTIVE_POWER_LIMIT', { limit: limitKw });
    return { success: true, message: `Power limit set to ${limitKw}kW` };
  }

  async setPeakShaving(plantId: string, enabled: boolean, thresholdKw: number = 50) {
    this.logger.log(`Setting peak shaving for ${plantId}: ${enabled} (Threshold: ${thresholdKw}kW)`);
    this.peakShavingStates.set(plantId, { enabled, threshold: thresholdKw });
    this.iotGateway.publishCommand(plantId, 'SET_PEAK_SHAVING', { enabled, threshold: thresholdKw });
    return { success: true, message: `Peak shaving ${enabled ? 'enabled' : 'disabled'}` };
  }

  async setGridExportLimit(plantId: string, limitKw: number) {
      this.logger.log(`Setting grid export limit for ${plantId} to ${limitKw}kW`);
      // In a real system, this would be persisted.
      return { success: true, message: `Export limit set to ${limitKw}kW` };
  }

  async setDynamicTariff(plantId: string, tariffData: any) {
      this.logger.log(`Setting dynamic tariff for ${plantId}`, tariffData);
      return { success: true, message: 'Tariff schedule updated' };
  }

  @OnEvent('telemetry.received')
  handleTelemetry(payload: { plantId: string, data: any }) {
      const { plantId, data } = payload;
      const config = this.peakShavingStates.get(plantId);

      // Simulate Load: Random load between 30kW and 100kW
      const simulatedLoad = 30 + Math.random() * 70;
      
      // Net Load = Load - Solar Generation
      // Positive = Import, Negative = Export
      const netLoad = simulatedLoad - data.kwGeneration;

      if (config?.enabled) {
          if (netLoad > config.threshold) {
              this.logger.warn(`[Peak Shaving] High Net Load detected (${netLoad.toFixed(2)}kW > ${config.threshold}kW). Discharging battery...`);
              this.iotGateway.publishCommand(plantId, 'BATTERY_DISCHARGE', { targetKw: netLoad - config.threshold });
          } else {
              this.logger.debug(`[Peak Shaving] Load stable (Net: ${netLoad.toFixed(2)}kW). No action.`);
          }
      }

      // Check Grid Export Limit (Logic Simulation)
      // If we are exporting (netLoad < 0) and abs(netLoad) > limit
      const exportLimit = 10; // Default 10kW for demo
      if (netLoad < 0 && Math.abs(netLoad) > exportLimit) {
           this.logger.warn(`[Smart Grid] Export limit exceeded (${Math.abs(netLoad).toFixed(2)}kW > ${exportLimit}kW). Throttling inverter...`);
           this.iotGateway.publishCommand(plantId, 'SET_ACTIVE_POWER_LIMIT', { limit: 100 - (Math.abs(netLoad) - exportLimit) }); // Dummy logic
      }
  }
}
