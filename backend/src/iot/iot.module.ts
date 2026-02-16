import { Module } from '@nestjs/common';
import { IotGatewayService } from './iot-gateway.service';
import { MonitoringModule } from '../monitoring/monitoring.module';

@Module({
  imports: [MonitoringModule],
  providers: [IotGatewayService],
  exports: [IotGatewayService]
})
export class IotModule {}
