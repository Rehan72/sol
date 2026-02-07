import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantAdminService } from './plantAdmin.service';
import { PlantAdminController } from './plantAdmin.controller';
import { User } from '../entities/user.entity';
import { Plant } from '../entities/plant.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Plant])],
    controllers: [PlantAdminController],
    providers: [PlantAdminService],
    exports: [PlantAdminService],
})
export class PlantAdminModule { }
