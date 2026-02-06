import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UsePipes,
  Get,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CustomerOnboardingDto } from '../auth/dto/customerOnborading.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { onboardingSchema } from '../common/schemas/validation.schema';
import { Role } from '../common/enums/role.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('customerOnboarding')
  @UseGuards(AccessTokenGuard)
  @UsePipes(new ZodValidationPipe(onboardingSchema))
  async onboardCustomer(@Req() req: any, @Body() dto: CustomerOnboardingDto) {
    return this.customerService.onboardCustomer(req.user.sub, dto);
  }

  @Get('profile')
  @UseGuards(AccessTokenGuard)
  async getProfile(@Req() req: any) {
    return this.customerService.getProfile(req.user.sub);
  }

  @Post('assign-survey')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(Role.PLANT_ADMIN, Role.SUPER_ADMIN)
  async assignSurvey(@Body() body: { customerId: string; teamName: string }) {
    return this.customerService.assignSurveyTeam(body.customerId, body.teamName);
  }
}
