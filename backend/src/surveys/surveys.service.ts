import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from '../entities/survey.entity';
import { User } from '../entities/user.entity';
import { Role } from '../common/enums/role.enum';
import { QuotationsService } from '../quotations/quotations.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType, NotificationChannel } from '../entities/notification.entity';
import { CostEstimationService } from '../cost-estimation/cost-estimation.service';

@Injectable()
export class SurveysService {
    constructor(
        @InjectRepository(Survey)
        private surveyRepository: Repository<Survey>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly quotationsService: QuotationsService,
        private readonly notificationsService: NotificationsService,
        private readonly costEstimationService: CostEstimationService,
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
        
        // Validation (Basic check) - Logic here can be expanded to check specific photo fields if needed
        // For now, we proceed to complete the survey.

        survey.status = 'COMPLETED';
        await this.surveyRepository.save(survey);

        // Update Customer Status to COMPLETED so it disappears from Pending Surveys in Dashboard
        let customer = null;
        if (survey.customerId) {
            customer = await this.userRepository.findOne({ where: { id: survey.customerId } });
        } else if (survey.customerEmail) {
            customer = await this.userRepository.findOne({
                where: {
                    email: survey.customerEmail,
                    role: Role.CUSTOMER
                }
            });
        }

        if (customer) {
            customer.surveyStatus = 'COMPLETED'; 
            customer.installationStatus = 'SURVEY_COMPLETED';
            await this.userRepository.save(customer);

            // Notify Customer
            await this.notificationsService.send(
                customer.id,
                'Survey Completed ✅',
                'Your site survey has been marked as completed by our team. Please wait for approval.',
                NotificationType.INFO
            );
        }

        return survey;
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

                // Send Notification
                await this.notificationsService.send(
                    customer.id,
                    'Survey Approved! 🚀',
                    'Your site survey has been approved. A draft quotation is now ready for your review.',
                    NotificationType.SUCCESS,
                    [NotificationChannel.SYSTEM]
                );
            }
        }

        // --- NEW AUTO-PRICING FLOW ---
        // 1. Generate BOQ (Cost Estimation) using Pricing Engine
        const estimation = await this.costEstimationService.generateFromSurvey(id, parseInt(adminId));
        
        // 2. Finalize BOQ (Auto-finalize for auto-generation)
        await this.costEstimationService.finalize(estimation.id);

        // 3. Generate Official Quotation from finalized BOQ
        return this.quotationsService.generateFromEstimation(estimation.id);
    }

    async rejectSurvey(id: number, adminId: string, reason: string) {
        const survey = await this.findOne(id);
        survey.status = 'REJECTED';
        survey.specialNotes = survey.specialNotes ? `${survey.specialNotes} | Rejection Reason: ${reason}` : `Rejection Reason: ${reason}`;
        
        const savedSurvey = await this.surveyRepository.save(survey);

        // Notify Customer if applicable
        if (survey.customerId || survey.customerEmail) {
            const customer = survey.customerId 
                ? await this.userRepository.findOne({ where: { id: survey.customerId } })
                : await this.userRepository.findOne({ where: { email: survey.customerEmail, role: Role.CUSTOMER } });
            
            if (customer) {
                await this.notificationsService.send(
                    customer.id,
                    'Survey Rejected ⚠️',
                    `Your survey was rejected. Reason: ${reason}. Please update your details.`,
                    NotificationType.WARNING
                );
            }
        }

        return savedSurvey;
    }


}
