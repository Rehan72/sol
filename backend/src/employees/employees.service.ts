import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Plant } from '../entities/plant.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Plant)
        private plantRepository: Repository<Plant>,
    ) { }

    async create(createEmployeeDto: any, currentUser: User) {
        const { password, plantId, regionId, ...rest } = createEmployeeDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        const requestedRole = rest.role || Role.EMPLOYEE;

        // Authorization: Only SUPER_ADMIN and REGION_ADMIN can create PLANT_ADMIN or higher roles
        const elevatedRoles = [Role.PLANT_ADMIN, Role.REGION_ADMIN, Role.SUPER_ADMIN];
        if (elevatedRoles.includes(requestedRole)) {
            if (currentUser.role !== Role.SUPER_ADMIN && currentUser.role !== Role.REGION_ADMIN) {
                throw new ForbiddenException('You do not have permission to create this role');
            }
        }

        // If creating a PLANT_ADMIN, plant ID is required
        if (requestedRole === Role.PLANT_ADMIN) {
            if (!plantId) {
                throw new BadRequestException('Plant ID is required when creating a Plant Admin');
            }
            
            // Verify the plant exists
            const plant = await this.plantRepository.findOne({ where: { id: plantId } });
            if (!plant) {
                throw new NotFoundException(`Plant with ID ${plantId} not found`);
            }

            // Check if plant is already assigned to another admin
            const existingAdmin = await this.usersRepository
                .createQueryBuilder('user')
                .where('user.role = :role', { role: Role.PLANT_ADMIN })
                .andWhere("user.plant->>'id' = :plantId", { plantId })
                .getOne();

            if (existingAdmin) {
                throw new BadRequestException('This plant is already assigned to another admin');
            }
        }

        // If creating a REGION_ADMIN, region ID is required
        if (requestedRole === Role.REGION_ADMIN) {
            if (!regionId) {
                throw new BadRequestException('Region ID is required when creating a Region Admin');
            }
            
            // Check if region is already assigned to another admin
            const existingRegionAdmin = await this.usersRepository
                .createQueryBuilder('user')
                .where('user.role = :role', { role: Role.REGION_ADMIN })
                .andWhere("user.region->>'id' = :regionId", { regionId })
                .getOne();

            if (existingRegionAdmin) {
                throw new BadRequestException('This region is already assigned to another admin');
            }
        }

        const employeeData: any = {
            ...rest,
            password: hashedPassword,
            role: requestedRole,
        };

        // Assign plant if provided or if creating a PLANT_ADMIN
        if (plantId) {
            employeeData.plant = { id: plantId };
        } else if (currentUser.role === Role.PLANT_ADMIN && currentUser.plant?.id) {
            // If a Plant Admin is creating an employee, automatically assign their plant
            employeeData.plant = { id: currentUser.plant.id };
        }

        // Assign region if provided or if creating a REGION_ADMIN
        if (regionId) {
            employeeData.region = { id: regionId };
        } else if (currentUser.role === Role.REGION_ADMIN && currentUser.region?.id) {
            // If a Region Admin is creating an employee, automatically assign their region
            employeeData.region = { id: currentUser.region.id };
        }

        const employee = this.usersRepository.create(employeeData);

        try {
            return await this.usersRepository.save(employee);
        } catch (error) {
            // Handle duplicate email error
            if (error.code === '23505' && error.detail?.includes('email')) {
                throw new BadRequestException('An employee with this email address already exists');
            }
            throw error;
        }
    }

    async findAll(currentUser: User) {
        // Build query based on user role
        const query = this.usersRepository.createQueryBuilder('user');

        // Filter based on role hierarchy
        if (currentUser.role === Role.SUPER_ADMIN || currentUser.role === Role.REGION_ADMIN) {
            // Super Admin and Region Admin can see all employees (excluding themselves and other admins)
            query.where('user.role IN (:...roles)', { roles: [Role.EMPLOYEE, Role.PLANT_ADMIN, Role.REGION_ADMIN] });
        } else if (currentUser.role === Role.PLANT_ADMIN && currentUser.plant?.id) {
            // Plant Admin can only see employees under their plant
            // Use raw SQL for JSONB column query
            const plantId = currentUser.plant.id;
            const users = await this.usersRepository.query(
                `SELECT * FROM users WHERE role = $1 AND plant->>'id' = $2 AND id != $3`,
                [Role.EMPLOYEE, plantId, currentUser.id]
            );
            return users;
        } else {
            // For other roles, return empty array
            return [];
        }

        // Exclude the current user from results
        query.andWhere('user.id != :currentUserId', { currentUserId: currentUser.id });

        return query.getMany();
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
