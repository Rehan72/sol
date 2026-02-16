import { Injectable } from '@nestjs/common';

@Injectable()
export class FinancialIntelligenceService {
    // Constants for India (approx averages for 2026)
    private readonly CO2_OFFSET_KG_PER_KWH = 0.82; // 0.82 kg CO2 per unit
    private readonly TREES_PER_TON_CO2 = 45; // ~45 trees offset 1 ton CO2/year
    private readonly COAL_OFFSET_KG_PER_KWH = 0.5; // 0.5 kg coal per unit
    private readonly TARIFF_HIKE_ANNUAL = 0.05; // 5% annual hike in electricity rates

    calculateFinancialImpact(capacityKw: number, netCost: number, currentTariff: number) {
        const annualGeneration = capacityKw * 1500; // ~1500 units per kW per year
        
        const yearByYear = [];
        let totalSavings = 0;
        let cumulativeCashFlow = -netCost;
        let paybackYear = -1;

        for (let year = 1; year <= 25; year++) {
            const yearTariff = currentTariff * Math.pow(1 + this.TARIFF_HIKE_ANNUAL, year - 1);
            const yearSavings = annualGeneration * yearTariff;
            
            // Maintenance cost (e.g., 1% of project cost after year 5)
            const maintenance = year > 5 ? netCost * 0.01 : 0;
            const netYearlySaving = yearSavings - maintenance;
            
            totalSavings += netYearlySaving;
            cumulativeCashFlow += netYearlySaving;

            if (cumulativeCashFlow >= 0 && paybackYear === -1) {
                paybackYear = year;
            }

            yearByYear.push({
                year,
                savings: Math.round(netYearlySaving),
                cumulative: Math.round(cumulativeCashFlow),
                tariff: parseFloat(yearTariff.toFixed(2))
            });
        }

        return {
            annualSavings: Math.round(annualGeneration * currentTariff),
            paybackPeriodYears: paybackYear,
            savings25Years: Math.round(totalSavings),
            irr: this.calculateIRR(netCost, yearByYear.map(y => y.savings)),
            roi: parseFloat(((totalSavings / netCost) * 100).toFixed(2)),
            cashFlowForecast: yearByYear
        };
    }

    calculateEnvironmentalImpact(capacityKw: number) {
        const annualGeneration = capacityKw * 1500;
        const totalCo2SavedKg = annualGeneration * this.CO2_OFFSET_KG_PER_KWH;
        const totalTreesPlantation = (totalCo2SavedKg / 1000) * this.TREES_PER_TON_CO2;
        const coalSavedKg = annualGeneration * this.COAL_OFFSET_KG_PER_KWH;

        return {
            annualCo2SavedKg: Math.round(totalCo2SavedKg),
            lifetimeCo2SavedKg: Math.round(totalCo2SavedKg * 25),
            treesEquivalent: Math.round(totalTreesPlantation),
            coalSavedKg: Math.round(coalSavedKg)
        };
    }

    // Simplified IRR calculation (Internal Rate of Return)
    private calculateIRR(initialInvestment: number, cashFlows: number[]): number {
        // Simple approximation for solar IRR
        const totalSavings = cashFlows.reduce((a, b) => a + b, 0);
        const simpleIrr = (totalSavings / initialInvestment / 25) * 100;
        return parseFloat(simpleIrr.toFixed(2));
    }

    calculateGstSavings(netCost: number) {
        // GST for solar is typically 12% in India (as of recent rules)
        // Businesses can claim Input Tax Credit (ITC)
        const gstAmount = netCost * 0.12;
        return {
            gstAmount: Math.round(gstAmount),
            netAfterGst: Math.round(netCost - gstAmount),
            message: 'Eligible for 12% Input Tax Credit'
        };
    }

    getLoanRepaymentModel(netCost: number, rate: number = 8.5, years: number = 10) {
        const monthlyRate = (rate / 100) / 12;
        const numberOfPayments = years * 12;
        const emi = netCost * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        const annualPayment = emi * 12;
        const totalPayment = emi * numberOfPayments;
        const totalInterest = totalPayment - netCost;

        return {
            monthlyEmi: Math.round(emi),
            annualPayment: Math.round(annualPayment),
            totalInterest: Math.round(totalInterest),
            totalPayment: Math.round(totalPayment)
        };
    }
}
