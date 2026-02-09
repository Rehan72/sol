import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from '../entities/survey.entity';
import { User } from '../entities/user.entity';
import { Role } from '../common/enums/role.enum';
import { QuotationsService } from '../quotations/quotations.service';

@Injectable()
export class SurveysService {
    constructor(
        @InjectRepository(Survey)
        private surveyRepository: Repository<Survey>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly quotationsService: QuotationsService,
    ) { }

    async create(createSurveyDto: any) {
        const survey = this.surveyRepository.create({
            ...createSurveyDto,
            status: 'DRAFT',
        });
        return this.surveyRepository.save(survey);
    }

    async findAll() {
        return this.surveyRepository.find();
    }

    async findOne(id: number) {
        const survey = await this.surveyRepository.findOne({ where: { id } });
        if (!survey) throw new NotFoundException(`Survey #${id} not found`);
        return survey;
    }

    async update(id: number, updateSurveyDto: any) {
        const survey = await this.surveyRepository.preload({
            id: id,
            ...updateSurveyDto,
        });
        if (!survey) {
            throw new NotFoundException(`Survey #${id} not found`);
        }
        return this.surveyRepository.save(survey);
    }

    async completeSurvey(id: number) {
        const survey = await this.findOne(id);
        survey.status = 'COMPLETED';
        await this.surveyRepository.save(survey);

        // Update Customer Status
        if (survey.customerEmail) {
            const customer = await this.userRepository.findOne({
                where: {
                    email: survey.customerEmail,
                    role: Role.CUSTOMER
                }
            });

            if (customer) {
                customer.surveyStatus = 'COMPLETED';
                customer.installationStatus = 'QUOTATION_READY';
                await this.userRepository.save(customer);
            }
        }

        // Trigger Auto-Flow
        return this.quotationsService.generateDraftQuotation(id);
    }
}
