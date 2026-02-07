import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plant } from '../entities/plant.entity';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';

@Injectable()
export class PlantService {
    constructor(
        @InjectRepository(Plant)
        private plantRepository: Repository<Plant>,
    ) { }

    async create(createPlantDto: CreatePlantDto): Promise<Plant> {
        const plant = this.plantRepository.create(createPlantDto);
        return await this.plantRepository.save(plant);
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
