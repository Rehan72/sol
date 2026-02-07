import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [EmployeesController],
    providers: [EmployeesService]
})
export class EmployeesModule { }
