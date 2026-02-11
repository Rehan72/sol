import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Plant } from '../entities/plant.entity';
import { CreatePlantAdminDto } from './dto/create-plant-admin.dto';
import { UpdatePlantAdminDto } from './dto/update-plant-admin.dto';
import { Role } from '../common/enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PlantAdminService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Plant)
        private readonly plantRepository: Repository<Plant>,
    ) { }

    async create(createPlantAdminDto: CreatePlantAdminDto): Promise<User> {
        // Check if email already exists
        const existingUser = await this.userRepository.findOne({
            where: { email: createPlantAdminDto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        // Verify plant exists and is not already assigned
        const plant = await this.plantRepository.findOne({
            where: { id: createPlantAdminDto.assignedPlantId },
        });

        if (!plant) {
            throw new NotFoundException(`Plant with ID ${createPlantAdminDto.assignedPlantId} not found`);
        }

        // Check if plant is already assigned to another admin
        const existingAssignment = await this.userRepository
            .createQueryBuilder('user')
            .where('user.role = :role', { role: Role.PLANT_ADMIN })
            .andWhere("user.plant->>'id' = :plantId", { plantId: createPlantAdminDto.assignedPlantId })
            .getOne();

        if (existingAssignment) {
            throw new ConflictException('This plant is already assigned to another admin');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            createPlantAdminDto.password,
            10,
        );

        // Create plant admin
        const plantAdmin = this.userRepository.create({
            name: createPlantAdminDto.name,
            email: createPlantAdminDto.email,
            phone: createPlantAdminDto.phone,
            password: hashedPassword,
            role: Role.PLANT_ADMIN,
            status: createPlantAdminDto.status || 'active',
            plant: { id: createPlantAdminDto.assignedPlantId },
            termAccepted: true,
            isOnboarded: true,
        });

        const savedPlantAdmin = await this.userRepository.save(plantAdmin);

        // Remove password from response
        delete savedPlantAdmin.password;
        delete savedPlantAdmin.hashedRefreshToken;

        return savedPlantAdmin;
    }

    async findAll(currentUser: User): Promise<any[]> {
        const where: any = { role: Role.PLANT_ADMIN };

        // If a Plant Admin is fetching, they only see themselves (or their assigned plant's admins)
        if (currentUser.role === Role.PLANT_ADMIN && currentUser.plant?.id) {
            where.id = currentUser.id;
        }

        const plantAdmins = await this.userRepository.find({
            where,
            select: [
                'id',
                'name',
                'email',
                'phone',
                'status',
                'isOnboarded',
                'role',
                'plant',
            ],
        });

        // Enrich with plant details
        const enrichedAdmins = await Promise.all(
            plantAdmins.map(async (admin) => {
                let assignedPlant = null;
                if (admin.plant?.id) {
                    assignedPlant = await this.plantRepository.findOne({
                        where: { id: admin.plant.id },
                        select: ['id', 'plantName', 'plantCode', 'location', 'state'],
                    });
                }

                return {
                    id: admin.id,
                    fullName: admin.name,
                    email: admin.email,
                    mobile: admin.phone,
                    role: admin.role,
                    status: admin.status,
                    assignedPlant: assignedPlant ? {
                        id: assignedPlant.id,
                        name: assignedPlant.plantName,
                        code: assignedPlant.plantCode,
                        region: assignedPlant.state,
                    } : null,
                };
            })
        );

        return enrichedAdmins;
    }

    async findOne(id: string): Promise<any> {
        const plantAdmin = await this.userRepository.findOne({
            where: { id, role: Role.PLANT_ADMIN },
            select: [
                'id',
                'name',
                'email',
                'phone',
                'status',
                'isOnboarded',
                'role',
                'plant',
            ],
        });

        if (!plantAdmin) {
            throw new NotFoundException(`Plant Admin with ID ${id} not found`);
        }

        // Enrich with plant details
        let assignedPlant = null;
        if (plantAdmin.plant?.id) {
            assignedPlant = await this.plantRepository.findOne({
                where: { id: plantAdmin.plant.id },
                select: ['id', 'plantName', 'plantCode', 'location', 'state'],
            });
        }

        return {
            id: plantAdmin.id,
            fullName: plantAdmin.name,
            email: plantAdmin.email,
            mobile: plantAdmin.phone,
            role: plantAdmin.role,
            status: plantAdmin.status,
            assignedPlant: assignedPlant ? {
                id: assignedPlant.id,
                name: assignedPlant.plantName,
                code: assignedPlant.plantCode,
                region: assignedPlant.state,
            } : null,
        };
    }

    async update(
        id: string,
        updatePlantAdminDto: UpdatePlantAdminDto,
    ): Promise<User> {
        const plantAdmin = await this.userRepository.findOne({
            where: { id, role: Role.PLANT_ADMIN },
        });

        if (!plantAdmin) {
            throw new NotFoundException(`Plant Admin with ID ${id} not found`);
        }

        // If updating plant assignment, verify plant exists
        if (updatePlantAdminDto.assignedPlantId) {
            const plant = await this.plantRepository.findOne({
                where: { id: updatePlantAdminDto.assignedPlantId },
            });

            if (!plant) {
                throw new NotFoundException(`Plant with ID ${updatePlantAdminDto.assignedPlantId} not found`);
            }

            plantAdmin.plant = { id: updatePlantAdminDto.assignedPlantId };
        }

        // If password is being updated, hash it
        if (updatePlantAdminDto.password) {
            updatePlantAdminDto.password = await bcrypt.hash(
                updatePlantAdminDto.password,
                10,
            );
        }

        // Update plant admin
        if (updatePlantAdminDto.name) plantAdmin.name = updatePlantAdminDto.name;
        if (updatePlantAdminDto.email) plantAdmin.email = updatePlantAdminDto.email;
        if (updatePlantAdminDto.phone) plantAdmin.phone = updatePlantAdminDto.phone;
        if (updatePlantAdminDto.status) plantAdmin.status = updatePlantAdminDto.status;
        if (updatePlantAdminDto.password) plantAdmin.password = updatePlantAdminDto.password;

        const updatedPlantAdmin = await this.userRepository.save(plantAdmin);

        // Remove sensitive fields
        delete updatedPlantAdmin.password;
        delete updatedPlantAdmin.hashedRefreshToken;

        return updatedPlantAdmin;
    }

    async remove(id: string): Promise<{ message: string }> {
        const plantAdmin = await this.userRepository.findOne({
            where: { id, role: Role.PLANT_ADMIN },
        });

        if (!plantAdmin) {
            throw new NotFoundException(`Plant Admin with ID ${id} not found`);
        }

        await this.userRepository.remove(plantAdmin);

        return {
            message: `Plant Admin ${plantAdmin.name} deleted successfully`,
        };
    }

    async getStatistics(): Promise<{
        total: number;
        active: number;
        byPlant: { plantName: string; count: number }[];
    }> {
        const total = await this.userRepository.count({
            where: { role: Role.PLANT_ADMIN },
        });

        const active = await this.userRepository.count({
            where: { role: Role.PLANT_ADMIN, status: 'active' },
        });

        // Get all plant admins with their plant assignments
        const plantAdmins = await this.userRepository.find({
            where: { role: Role.PLANT_ADMIN },
            select: ['plant'],
        });

        // Count by plant
        const plantCounts = new Map<string, number>();
        for (const admin of plantAdmins) {
            if (admin.plant?.id) {
                const count = plantCounts.get(admin.plant.id) || 0;
                plantCounts.set(admin.plant.id, count + 1);
            }
        }

        // Enrich with plant names
        const byPlant = await Promise.all(
            Array.from(plantCounts.entries()).map(async ([plantId, count]) => {
                const plant = await this.plantRepository.findOne({
                    where: { id: plantId },
                    select: ['plantName'],
                });
                return {
                    plantName: plant?.plantName || 'Unknown',
                    count,
                };
            })
        );

        return {
            total,
            active,
            byPlant,
        };
    }
}
