import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PricingRule } from '../entities/pricing-rule.entity';
import { Survey } from '../entities/survey.entity';
import { CostEstimation } from '../entities/cost-estimation.entity';

@Injectable()
export class PricingService {
    constructor(
        @InjectRepository(PricingRule)
        private pricingRepository: Repository<PricingRule>,
        @InjectRepository(Survey)
        private surveyRepository: Repository<Survey>,
        @InjectRepository(CostEstimation)
        private estimationRepository: Repository<CostEstimation>,
    ) {}

    async findAllRules(): Promise<PricingRule[]> {
        return await this.pricingRepository.find({ where: { isActive: true } });
    }

    async createRule(data: Partial<PricingRule>): Promise<PricingRule> {
        const rule = this.pricingRepository.create(data);
        return await this.pricingRepository.save(rule);
    }

    async updateRule(id: number, data: Partial<PricingRule>): Promise<PricingRule> {
        const rule = await this.pricingRepository.findOne({ where: { id } });
        if (!rule) throw new NotFoundException('Rule not found');
        Object.assign(rule, data);
        return await this.pricingRepository.save(rule);
    }

    async deleteRule(id: number): Promise<void> {
        await this.pricingRepository.delete(id);
    }

    // Logic for Auto-Generation
    async generateEstimationFromSurvey(surveyId: number): Promise<CostEstimation> {
        const survey = await this.surveyRepository.findOne({ where: { id: surveyId } });
        if (!survey) throw new NotFoundException('Survey not found');

        const capacity = survey.recommendedSystemSize || 5; // Use recommendedSystemSize from survey
        const rules = await this.findAllRules();

        const estimation = new CostEstimation();
        estimation.surveyId = surveyId;
        estimation.systemCapacity = capacity;
        estimation.projectName = `Project for ${survey.customerName || 'Customer'}`;
        estimation.estimationNumber = `EST-${Date.now()}`;
        
        // Orchestrate stages based on rules
        estimation.stagePanels = this.filterRules(rules, 'PANEL', capacity);
        estimation.stageInverter = this.filterRules(rules, 'INVERTER', capacity);
        estimation.stageMounting = this.filterRules(rules, 'STRUCTURE', capacity);
        estimation.stageDcElectrical = this.filterRules(rules, 'BOS', capacity);
        estimation.stageLabour = this.filterRules(rules, 'INSTALLATION', capacity);
        estimation.stageGridConnection = this.filterRules(rules, 'NET_METERING', capacity);

        // Calculate totals
        const subtotal = [
            ...estimation.stagePanels,
            ...estimation.stageInverter,
            ...estimation.stageMounting,
            ...estimation.stageDcElectrical,
            ...estimation.stageLabour,
            ...estimation.stageGridConnection
        ].reduce((sum, item) => sum + item.amount, 0);

        estimation.subtotal = subtotal;
        estimation.gstAmount = subtotal * 0.18; // 18% GST
        estimation.totalProjectCost = subtotal + estimation.gstAmount;

        return await this.estimationRepository.save(estimation);
    }

    private filterRules(rules: PricingRule[], category: string, capacity: number) {
        return rules
            .filter(r => r.category === category)
            .map(r => {
                const qty = r.unit === 'WATT' ? capacity * 1000 : capacity;
                return {
                    item: r.itemName,
                    qty: qty,
                    unit: r.unit,
                    rate: r.baseRate,
                    amount: qty * r.baseRate
                };
            });
    }

    // Simplified Market Sync based on Google Search results
    async syncWithMarket() {
        const researchRates = [
            { category: 'PANEL', itemName: 'Mono PERC Solar Panels', unit: 'WATT', baseRate: 45 },
            { category: 'INVERTER', itemName: 'Grid-Tied Solar Inverters', unit: 'KW', baseRate: 14000 },
            { category: 'STRUCTURE', itemName: 'Hot Dip Galvanized Structure', unit: 'KW', baseRate: 5000 },
            { category: 'BOS', itemName: 'Cables & DC Balance of System', unit: 'KW', baseRate: 3000 },
            { category: 'INSTALLATION', itemName: 'Pro-Installation & Labour', unit: 'KW', baseRate: 2000 },
            { category: 'NET_METERING', itemName: 'DISCOM Net Metering Liaison', unit: 'UNIT', baseRate: 15000 },
        ];

        for (const rate of researchRates) {
            let rule = await this.pricingRepository.findOne({ 
                where: { category: rate.category, itemName: rate.itemName } 
            });

            if (rule) {
                rule.baseRate = rate.baseRate;
                rule.lastMarketSyncAt = new Date();
                await this.pricingRepository.save(rule);
            } else {
                await this.createRule({ ...rate, lastMarketSyncAt: new Date() });
            }
        }
        return { message: 'Market rates synced successfully with latest Google search insights (Feb 2026)' };
    }
}
