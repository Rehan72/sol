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
import { RegionAdminService } from './regionAdmin.service';
import { CreateRegionAdminDto } from './dto/create-region-admin.dto';
import { UpdateRegionAdminDto } from './dto/update-region-admin.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Region Admin')
@Controller('region-admin')
@UseGuards(AccessTokenGuard, RolesGuard)
@ApiBearerAuth()
export class RegionAdminController {
  constructor(private readonly regionAdminService: RegionAdminService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new region admin' })
  @ApiResponse({
    status: 201,
    description: 'Region admin created successfully',
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() createRegionAdminDto: CreateRegionAdminDto) {
    return this.regionAdminService.create(createRegionAdminDto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.REGION_ADMIN)
  @ApiOperation({ summary: 'Get all region admins' })
  @ApiResponse({
    status: 200,
    description: 'List of all region admins',
  })
  async findAll() {
    return this.regionAdminService.findAll();
  }

  @Get('statistics')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get region admin statistics' })
  @ApiResponse({
    status: 200,
    description: 'Region admin statistics',
  })
  async getStatistics() {
    return this.regionAdminService.getStatistics();
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.REGION_ADMIN)
  @ApiOperation({ summary: 'Get a region admin by ID' })
  @ApiResponse({
    status: 200,
    description: 'Region admin details',
  })
  @ApiResponse({ status: 404, description: 'Region admin not found' })
  async findOne(@Param('id') id: string) {
    return this.regionAdminService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.REGION_ADMIN)
  @ApiOperation({ summary: 'Update a region admin' })
  @ApiResponse({
    status: 200,
    description: 'Region admin updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Region admin not found' })
  async update(
    @Param('id') id: string,
    @Body() updateRegionAdminDto: UpdateRegionAdminDto,
  ) {
    return this.regionAdminService.update(id, updateRegionAdminDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a region admin' })
  @ApiResponse({
    status: 200,
    description: 'Region admin deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Region admin not found' })
  async remove(@Param('id') id: string) {
    return this.regionAdminService.remove(id);
  }
}
