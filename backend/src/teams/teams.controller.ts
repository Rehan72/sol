import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Teams')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('teams')
export class TeamsController {
    constructor(private readonly teamsService: TeamsService) { }

    @Post()
    create(@Body() createTeamDto: any, @Req() req: any) {
        return this.teamsService.create(createTeamDto, req.user);
    }

    @Get()
    findAll(@Query() query: any, @Req() req: any) {
        return this.teamsService.findAll(query, req.user);
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
