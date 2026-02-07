import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) { }

    @Post()
    create(@Body() createTeamDto: any) {
        return this.teamsService.create(createTeamDto);
    }

    @Get()
    findAll(@Query() query: any) {
        return this.teamsService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.teamsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTeamDto: any) {
        return this.teamsService.update(id, updateTeamDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.teamsService.remove(id);
    }
}
