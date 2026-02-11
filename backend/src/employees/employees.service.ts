import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createEmployeeDto: any, currentUser: User) {
        const { password, ...rest } = createEmployeeDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        const employeeData: any = {
            ...rest,
            password: hashedPassword,
            role: rest.role || Role.EMPLOYEE,
        };

        // If a Plant Admin is creating an employee, automatically assign their plant
        if (currentUser.role === Role.PLANT_ADMIN && currentUser.plant?.id) {
            employeeData.plant = { id: currentUser.plant.id };
        }

        const employee = this.usersRepository.create(employeeData);

        return this.usersRepository.save(employee);
    }

    async findAll(currentUser: User) {
        const where: any = { role: Role.EMPLOYEE };

        // If a Plant Admin is fetching employees, only show those assigned to their plant
        if (currentUser.role === Role.PLANT_ADMIN && currentUser.plant?.id) {
            where.plant = { id: currentUser.plant.id };
        }

        return this.usersRepository.find({
            where,
        });
    }

    async findOne(id: string) {
        const employee = await this.usersRepository.findOne({
            where: { id, role: Role.EMPLOYEE },
        });
        if (!employee) {
            throw new NotFoundException(`Employee with ID ${id} not found`);
        }
        return employee;
    }

    async update(id: string, updateEmployeeDto: any) {
        const employee = await this.findOne(id);
        // If password is being updated, hash it
        if (updateEmployeeDto.password) {
            updateEmployeeDto.password = await bcrypt.hash(updateEmployeeDto.password, 10);
        }

        await this.usersRepository.update(id, updateEmployeeDto);
        return this.findOne(id);
    }

    async remove(id: string) {
        const employee = await this.findOne(id);
        return this.usersRepository.remove(employee);
    }
}
