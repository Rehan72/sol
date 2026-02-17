import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plant } from '../entities/plant.entity';
import { User } from '../entities/user.entity';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class PlantService {
    private readonly logger = new Logger(PlantService.name);

    constructor(
        @InjectRepository(Plant)
        private plantRepository: Repository<Plant>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async create(createPlantDto: CreatePlantDto): Promise<Plant> {
        const plant = this.plantRepository.create(createPlantDto);
        const savedPlant = await this.plantRepository.save(plant);

        // Create user for Plant Owner/GridPlant if password is provided
        if (createPlantDto.password && createPlantDto.ownerEmail) {
            try {
                const existingUser = await this.userRepository.findOne({ where: { email: createPlantDto.ownerEmail } });
                if (!existingUser) {
                    const hashedPassword = await bcrypt.hash(createPlantDto.password, 10);
                    const newUser = this.userRepository.create({
                        name: createPlantDto.ownerName,
                        email: createPlantDto.ownerEmail,
                        password: hashedPassword,
                        phone: createPlantDto.ownerPhone,
                        role: Role.PLANTS, // Assuming PLANTS role for GridPlant owner
                        plant: { id: savedPlant.id },
                        isOnboarded: true
                    });
                    await this.userRepository.save(newUser);
                    this.logger.log(`Created user for plant owner: ${createPlantDto.ownerEmail}`);
                } else {
                    this.logger.warn(`User ${createPlantDto.ownerEmail} already exists, skipping creation.`);
                }
            } catch (error) {
                this.logger.error(`Failed to create user for plant owner: ${error.message}`, error.stack);
                // Non-blocking error, plant is already created
            }
        }

        return savedPlant;
    }

    async findAll(): Promise<Plant[]> {
        return await this.plantRepository.find({
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async findOne(id: string): Promise<Plant> {
        const plant = await this.plantRepository.findOne({
            where: { id },
        });

        if (!plant) {
            throw new NotFoundException(`Plant with ID ${id} not found`);
        }

        return plant;
    }

    async update(id: string, updatePlantDto: UpdatePlantDto): Promise<Plant> {
        const plant = await this.findOne(id);

        Object.assign(plant, updatePlantDto);

        return await this.plantRepository.save(plant);
    }

    async remove(id: string): Promise<void> {
        const plant = await this.findOne(id);
        await this.plantRepository.remove(plant);
    }

    async getStatistics() {
        const plants = await this.findAll();

        const totalPlants = plants.length;
        const totalCapacity = plants.reduce((sum, plant) => sum + Number(plant.capacity || 0), 0);
        const totalGeneration = plants.reduce((sum, plant) => sum + Number(plant.generation || 0), 0);
        const avgEfficiency = plants.length > 0
            ? plants.reduce((sum, plant) => sum + Number(plant.efficiency || 0), 0) / plants.length
            : 0;

        return {
            totalPlants,
            totalCapacity: `${totalCapacity.toFixed(0)} kW`,
            todaysGeneration: `${totalGeneration.toFixed(0)} kWh`,
            avgEfficiency: `${avgEfficiency.toFixed(1)}%`,
        };
    }
}
