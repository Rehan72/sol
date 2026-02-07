import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PlantService } from './plant.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';

@ApiTags('plant')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('plant')
export class PlantController {
    constructor(private readonly plantService: PlantService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new plant' })
    @ApiResponse({ status: 201, description: 'Plant created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    create(@Body() createPlantDto: CreatePlantDto) {
        return this.plantService.create(createPlantDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all plants' })
    @ApiResponse({ status: 200, description: 'Returns all plants' })
    findAll() {
        return this.plantService.findAll();
    }

    @Get('statistics')
    @ApiOperation({ summary: 'Get plant statistics' })
    @ApiResponse({ status: 200, description: 'Returns plant statistics' })
    getStatistics() {
        return this.plantService.getStatistics();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get plant by ID' })
    @ApiResponse({ status: 200, description: 'Returns the plant' })
    @ApiResponse({ status: 404, description: 'Plant not found' })
    findOne(@Param('id') id: string) {
        return this.plantService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update plant' })
    @ApiResponse({ status: 200, description: 'Plant updated successfully' })
    @ApiResponse({ status: 404, description: 'Plant not found' })
    update(@Param('id') id: string, @Body() updatePlantDto: UpdatePlantDto) {
        return this.plantService.update(id, updatePlantDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete plant' })
    @ApiResponse({ status: 204, description: 'Plant deleted successfully' })
    @ApiResponse({ status: 404, description: 'Plant not found' })
    remove(@Param('id') id: string) {
        return this.plantService.remove(id);
    }
}
