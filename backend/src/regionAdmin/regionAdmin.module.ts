import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionAdminService } from './regionAdmin.service';
import { RegionAdminController } from './regionAdmin.controller';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [RegionAdminController],
  providers: [RegionAdminService],
  exports: [RegionAdminService],
})
export class RegionAdminModule {}
