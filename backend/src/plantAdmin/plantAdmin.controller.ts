import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PlantAdminService } from './plantAdmin.service';
import { CreatePlantAdminDto } from './dto/create-plant-admin.dto';
import { UpdatePlantAdminDto } from './dto/update-plant-admin.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Plant Admin')
@Controller('plant-admin')
@UseGuards(AccessTokenGuard, RolesGuard)
@ApiBearerAuth()
export class PlantAdminController {
    constructor(private readonly plantAdminService: PlantAdminService) { }

    @Post()
    @Roles(Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Create a new plant admin' })
    @ApiResponse({
        status: 201,
        description: 'Plant admin created successfully',
    })
    @ApiResponse({ status: 409, description: 'Email already exists or plant already assigned' })
    async create(@Body() createPlantAdminDto: CreatePlantAdminDto) {
        return this.plantAdminService.create(createPlantAdminDto);
    }

    @Get()
    @Roles(Role.SUPER_ADMIN, Role.REGION_ADMIN, Role.PLANT_ADMIN)
    @ApiOperation({ summary: 'Get all plant admins' })
    @ApiResponse({
        status: 200,
        description: 'List of all plant admins',
    })
    async findAll() {
        return this.plantAdminService.findAll();
    }

    @Get('statistics')
    @Roles(Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Get plant admin statistics' })
    @ApiResponse({
        status: 200,
        description: 'Plant admin statistics',
    })
    async getStatistics() {
        return this.plantAdminService.getStatistics();
    }

    @Get(':id')
    @Roles(Role.SUPER_ADMIN, Role.REGION_ADMIN, Role.PLANT_ADMIN)
    @ApiOperation({ summary: 'Get a plant admin by ID' })
    @ApiResponse({
        status: 200,
        description: 'Plant admin details',
    })
    @ApiResponse({ status: 404, description: 'Plant admin not found' })
    async findOne(@Param('id') id: string) {
        return this.plantAdminService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.SUPER_ADMIN, Role.PLANT_ADMIN)
    @ApiOperation({ summary: 'Update a plant admin' })
    @ApiResponse({
        status: 200,
        description: 'Plant admin updated successfully',
    })
    @ApiResponse({ status: 404, description: 'Plant admin not found' })
    async update(
        @Param('id') id: string,
        @Body() updatePlantAdminDto: UpdatePlantAdminDto,
    ) {
        return this.plantAdminService.update(id, updatePlantAdminDto);
    }

    @Delete(':id')
    @Roles(Role.SUPER_ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a plant admin' })
    @ApiResponse({
        status: 200,
        description: 'Plant admin deleted successfully',
    })
    @ApiResponse({ status: 404, description: 'Plant admin not found' })
    async remove(@Param('id') id: string) {
        return this.plantAdminService.remove(id);
    }
}
