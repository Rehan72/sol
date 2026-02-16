import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CostEstimation } from '../entities/cost-estimation.entity';
import { Survey } from '../entities/survey.entity';
import { PricingService } from '../pricing/pricing.service';

@Injectable()
export class CostEstimationService {
    constructor(
        @InjectRepository(CostEstimation)
        private readonly repo: Repository<CostEstimation>,
        @InjectRepository(Survey)
        private readonly surveyRepo: Repository<Survey>,
        private readonly pricingService: PricingService,
    ) {}

    async create(dto: any, userId?: number): Promise<CostEstimation> {
        // Auto-generate estimation number
        const count = await this.repo.count();
        const estimationNumber = `EST-${String(count + 1).padStart(4, '0')}`;

        const entity = new CostEstimation();
        Object.assign(entity, {
            ...dto,
            estimationNumber,
            createdById: userId ?? dto.createdById ?? null,
        });

        return this.repo.save(entity);
    }

    async findAll(): Promise<CostEstimation[]> {
        return this.repo.find({
            order: { createdAt: 'DESC' },
            relations: ['createdBy'],
        });
    }

    async findOne(id: number): Promise<CostEstimation> {
        const estimation = await this.repo.findOne({
            where: { id },
            relations: ['createdBy'],
        });
        if (!estimation) {
            throw new NotFoundException(`Cost estimation #${id} not found`);
        }
        return estimation;
    }

    async update(id: number, dto: any): Promise<CostEstimation> {
        const estimation = await this.findOne(id);

        if (estimation.status === 'FINALIZED') {
            throw new NotFoundException('Cannot edit a finalized estimation');
        }

        Object.assign(estimation, dto);
        
        // Recalculate totals if stages are modified
        this.calculateTotals(estimation);

        return this.repo.save(estimation);
    }

    async remove(id: number): Promise<void> {
        const estimation = await this.findOne(id);
        await this.repo.remove(estimation);
    }

    async finalize(id: number): Promise<CostEstimation> {
        const estimation = await this.findOne(id);
        estimation.status = 'FINALIZED';
        return this.repo.save(estimation);
    }

    async generateFromSurvey(surveyId: number, userId?: number): Promise<CostEstimation> {
        // Delegate core generation to Pricing Engine
        const estimation = await this.pricingService.generateEstimationFromSurvey(surveyId);
        
        // Additional metadata if needed
        if (userId) estimation.createdById = userId;
        
        // Auto-generate number with correct prefix
        const count = await this.repo.count();
        estimation.estimationNumber = `EST-${String(count).padStart(4, '0')}`;
        
        return await this.repo.save(estimation);
    }

    async linkToQuotation(id: number, quotationId: number): Promise<void> {
        // Since there's a unique constraint on quotationId, we must unlink any other estimation first
        await this.repo.update({ quotationId }, { quotationId: null });
        // Now link the new one
        await this.repo.update(id, { quotationId });
    }

    private calculateTotals(est: CostEstimation) {
        let subtotal = 0;
        const stages = [
            est.stageDesign, est.stageMounting, est.stagePanels, 
            est.stageDcElectrical, est.stageInverter, est.stageGridConnection,
            est.stageEarthing, est.stageMonitoring, est.stageLabour
        ];

        stages.forEach(stage => {
            if (Array.isArray(stage)) {
                stage.forEach(item => subtotal += (item.amount || 0));
            }
        });

        const contingencyPct = est.contingencyPercent ?? 3;
        const gstPct = est.gstPercent ?? 18;

        est.subtotal = subtotal;
        est.contingencyAmount = (subtotal * contingencyPct) / 100;
        const taxableAmount = subtotal + est.contingencyAmount;
        est.gstAmount = (taxableAmount * gstPct) / 100;
        est.totalProjectCost = Math.round(taxableAmount + est.gstAmount);
    }
}
