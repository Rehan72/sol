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
        
        // Validation (Basic check)
        if (!survey.photoUrls || survey.photoUrls.length === 0) {
           // throw new BadRequestException('Photos are required to complete the survey');
        }

        survey.status = 'COMPLETED';
        return this.surveyRepository.save(survey);
    }

    async approveSurvey(id: number, adminId: string) {
        const survey = await this.findOne(id);
        if (survey.status !== 'COMPLETED') {
            throw new Error('Survey must be COMPLETED before it can be APPROVED');
        }

        survey.status = 'APPROVED';
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
                customer.surveyStatus = 'APPROVED';
                customer.installationStatus = 'QUOTATION_READY';
                await this.userRepository.save(customer);
            }
        }

        // Trigger Auto-Flow (Generate Draft Quotation)
        return this.quotationsService.generateDraftQuotation(id);
    }

    async rejectSurvey(id: number, adminId: string, reason: string) {
        const survey = await this.findOne(id);
        survey.status = 'REJECTED';
        survey.specialNotes = survey.specialNotes ? `${survey.specialNotes} | Rejection Reason: ${reason}` : `Rejection Reason: ${reason}`;
        
        // Reset to DRAFT? Or keep as REJECTED and let them edit?
        // Usually, revert to DRAFT or IN_PROGRESS to allow edits.
        // For now, let's keep it REJECTED or maybe revert to IN_PROGRESS so they can fix it.
        // survey.status = 'IN_PROGRESS'; 

        return this.surveyRepository.save(survey);
    }
}
