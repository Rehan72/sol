import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CustomerOnboardingDto } from '../auth/dto/customerOnborading.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async onboardCustomer(userId: string, dto: CustomerOnboardingDto) {
    await this.usersRepo.update(userId, {
      ...dto,
      isOnboarded: true,
      installationStatus: 'ONBOARDED',
    });
    return { message: 'Onboarding completed successfully' };
  }

  async getProfile(userId: string) {
    return this.usersRepo.findOneBy({ id: userId });
  }

  async assignSurveyTeam(customerId: string, teamName: string) {
    await this.usersRepo.update(customerId, {
      surveyStatus: 'ASSIGNED',
      assignedSurveyTeam: teamName,
    });
    return { message: 'Survey team assigned successfully' };
  }
}
