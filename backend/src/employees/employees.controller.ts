import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/access-token.guard';

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) { }

    @Post()
    create(@Body() createEmployeeDto: any) {
        return this.employeesService.create(createEmployeeDto);
    }

    @Get()
    findAll() {
        return this.employeesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.employeesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateEmployeeDto: any) {
        return this.employeesService.update(id, updateEmployeeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.employeesService.remove(id);
    }
}
