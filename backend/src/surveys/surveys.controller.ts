import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { SurveysService } from '../surveys/surveys.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('surveys')
export class SurveysController {
    constructor(private readonly surveysService: SurveysService) { }

    @Post()
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(Role.SURVEY_TEAM, Role.SUPER_ADMIN, Role.REGION_ADMIN, Role.PLANT_ADMIN, Role.EMPLOYEE)
    create(@Body() createSurveyDto: any) {
        return this.surveysService.create(createSurveyDto);
    }

    @Get()
    findAll() {
        return this.surveysService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.surveysService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateSurveyDto: any) {
        return this.surveysService.update(+id, updateSurveyDto);
    }

    @Post(':id/complete')
    completeSurvey(@Param('id') id: string) {
        return this.surveysService.completeSurvey(+id);
    }
}
