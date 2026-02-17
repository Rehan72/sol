import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Plant } from '../entities/plant.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Plant])],
    controllers: [EmployeesController],
    providers: [EmployeesService]
})
export class EmployeesModule { }
