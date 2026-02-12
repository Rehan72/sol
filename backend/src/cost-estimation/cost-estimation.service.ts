import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CostEstimation } from '../entities/cost-estimation.entity';
import { Survey } from '../entities/survey.entity';

@Injectable()
export class CostEstimationService {
    constructor(
        @InjectRepository(CostEstimation)
        private readonly repo: Repository<CostEstimation>,
        @InjectRepository(Survey)
        private readonly surveyRepo: Repository<Survey>,
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
        const survey = await this.surveyRepo.findOne({ where: { id: surveyId } });
        if (!survey) throw new NotFoundException('Survey not found');

        // 1. Calculate Recommended System Size
        // Assumption: 1 kW generates ~120 units/month
        let recommendedKw = 0;
        if (survey.averageMonthlyConsumption) {
            recommendedKw = Number((survey.averageMonthlyConsumption / 120).toFixed(2));
        } else if (survey.sanctionedLoad) {
            recommendedKw = Number((survey.sanctionedLoad * 0.8).toFixed(2)); // 80% of sanctioned load
        }
        
        // Adjust for shadow-free area (approx 10 sq.m per kW)
        if (survey.shadowFreeUsableArea) {
            const maxCapacityByArea = Number((survey.shadowFreeUsableArea / 10).toFixed(2));
            recommendedKw = Math.min(recommendedKw, maxCapacityByArea);
        }

        recommendedKw = Math.max(recommendedKw, 1); // Minimum 1 kW

        // 2. Base Rates (Mock Rates - in INR)
        const RATE_PANEL = 22000; // per kW
        const RATE_INVERTER = 12000; // per kW
        const RATE_STRUCTURE = survey.roofType === 'RCC' ? 4000 : 5500; // per kW (Metal/Tile might be higher/lower depending on structure)
        const RATE_INSTALLATION = 3000; // per kW
        
        // Cable Cost (DC + AC)
        const cableDist = (survey.distanceRoofToDB || 20) + (survey.cableRouteLength || 10);
        const cableEstCost = cableDist * 150; // approx 150 per meter for combo of cables

        // 3. Populate Stages
        const est = new CostEstimation();
        est.surveyId = survey.id;
        est.projectName = `Solar Project for ${survey.customerName || 'Customer'}`;
        est.systemCapacity = recommendedKw;
        est.plantType = survey.siteType || 'Rooftop';
        
        est.stagePanels = [{
            item: `Solar Modules (${Math.ceil(recommendedKw * 1000 / 550)} x 550Wp)`,
            qty: recommendedKw,
            unit: 'kW',
            rate: RATE_PANEL,
            amount: recommendedKw * RATE_PANEL
        }];

        est.stageInverter = [{
            item: `Grid Tie Inverter`,
            qty: recommendedKw,
            unit: 'kW',
            rate: RATE_INVERTER,
            amount: recommendedKw * RATE_INVERTER
        }];

        est.stageMounting = [{
            item: `Mounting Structure (${survey.roofType || 'Standard'})`,
            qty: recommendedKw,
            unit: 'kW',
            rate: RATE_STRUCTURE,
            amount: recommendedKw * RATE_STRUCTURE
        }];
        
        est.stageDcElectrical = [{
            item: 'DC Cables & Consumables',
            qty: 1,
            unit: 'Lot',
            rate: cableEstCost * 0.4, // 40% of cable budget for DC
            amount: cableEstCost * 0.4
        }];

        est.stageGridConnection = [{
            item: 'AC Cables & Grid Interfacing',
            qty: 1,
            unit: 'Lot',
            rate: cableEstCost * 0.6,
            amount: cableEstCost * 0.6
        }];

        est.stageLabour = [{
            item: 'Installation & Commissioning',
            qty: recommendedKw,
            unit: 'kW',
            rate: RATE_INSTALLATION,
            amount: recommendedKw * RATE_INSTALLATION
        }];
        
        if (survey.earthingAvailable === false) {
             est.stageEarthing = [{
                item: 'Earthing & Lightning Protection Kit',
                qty: 1,
                unit: 'Set',
                rate: 15000,
                amount: 15000
            }];
        }

        est.createdById = userId;

        this.calculateTotals(est);

        // Auto-generate number
        const count = await this.repo.count();
        est.estimationNumber = `EST-${String(count + 1).padStart(4, '0')}`;
        
        return this.repo.save(est);
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
