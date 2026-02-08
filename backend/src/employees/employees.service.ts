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

    async create(createEmployeeDto: any) {
        const { password, ...rest } = createEmployeeDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        const employee = this.usersRepository.create({
            ...rest,
            password: hashedPassword,
            role: rest.role || Role.EMPLOYEE,
        });

        return this.usersRepository.save(employee);
    }

    async findAll() {
        return this.usersRepository.find({
            where: { role: Role.EMPLOYEE },
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
