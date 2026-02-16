import { Module } from '@nestjs/common';
import { ControlService } from './control.service';
import { ControlController } from './control.controller';
import { IotModule } from '../iot/iot.module';

@Module({
  imports: [IotModule],
  controllers: [ControlController],
  providers: [ControlService],
  exports: [ControlService]
})
export class ControlModule {}
