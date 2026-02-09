import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UsePipes,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CustomerOnboardingDto } from '../auth/dto/customerOnborading.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { onboardingSchema } from '../common/schemas/validation.schema';
import { Role } from '../common/enums/role.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Customer')
@ApiBearerAuth()
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @Post('customerOnboarding')
  @UseGuards(AccessTokenGuard)
  @UsePipes(new ZodValidationPipe(onboardingSchema))
  async onboardCustomer(@Req() req: any, @Body() dto: CustomerOnboardingDto) {
    return this.customerService.onboardCustomer(req.user.id, dto);
  }

  @Get('profile')
  @UseGuards(AccessTokenGuard)
  async getProfile(@Req() req: any) {
    return this.customerService.getProfile(req.user.id);
  }

  @Post('assign-survey')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.PLANT_ADMIN, Role.SUPER_ADMIN, Role.EMPLOYEE)
  async assignSurvey(@Body() body: { customerId: string; teamId: string }, @Req() req: any) {
    return this.customerService.assignSurveyTeam(body.customerId, body.teamId, req.user.id);
  }

  @Get('solar-requests')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.PLANT_ADMIN, Role.REGION_ADMIN, Role.EMPLOYEE)
  async getSolarRequests(@Req() req: any) {
    return this.customerService.getSolarRequests(req.user);
  }

  @Get()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.PLANT_ADMIN, Role.REGION_ADMIN, Role.EMPLOYEE)
  async getAllCustomers(@Req() req: any) {
    return this.customerService.getAllCustomers(req.user);
  }

  @Post('assign-installation')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.PLANT_ADMIN, Role.SUPER_ADMIN, Role.EMPLOYEE)
  async assignInstallation(@Body() body: { customerId: string; teamId: string; startDate?: string }, @Req() req: any) {
    return this.customerService.assignInstallationTeam(body.customerId, body.teamId, body.startDate, req.user.id);
  }

  @Post('update-installation-status')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.PLANT_ADMIN, Role.SUPER_ADMIN, Role.EMPLOYEE)
  async updateInstallationStatus(@Body() body: { customerId: string; status: string }, @Req() req: any) {
    return this.customerService.updateInstallationStatus(body.customerId, body.status);
  }

  @Post('mark-installation-ready')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.PLANT_ADMIN, Role.SUPER_ADMIN, Role.EMPLOYEE)
  async markInstallationReady(@Body() body: { customerId: string }, @Req() req: any) {
    return this.customerService.markInstallationReady(body.customerId, req.user.id);
  }
}
