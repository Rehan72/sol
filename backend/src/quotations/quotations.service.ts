import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quotation } from '../entities/quotation.entity';
import { Survey } from '../entities/survey.entity';
import { QuotationApproval } from '../entities/quotation-approval.entity';
import { Role } from '../common/enums/role.enum';
import puppeteer from 'puppeteer';

@Injectable()
export class QuotationsService {
    constructor(
        @InjectRepository(Quotation)
        private quotationRepository: Repository<Quotation>,
        @InjectRepository(Survey)
        private surveyRepository: Repository<Survey>,
        @InjectRepository(QuotationApproval)
        private approvalRepository: Repository<QuotationApproval>,
    ) { }

    async create(createQuotationDto: any) {
        const quotation = this.quotationRepository.create(createQuotationDto);
        return this.quotationRepository.save(quotation);
    }

    async findAll() {
        return this.quotationRepository.find({ relations: ['survey'] });
    }

    async findOne(id: number) {
        const quotation = await this.quotationRepository.findOne({ where: { id }, relations: ['survey'] });
        if (!quotation) throw new NotFoundException(`Quotation #${id} not found`);
        return quotation;
    }

    async update(id: number, updateQuotationDto: any) {
        const quotation = await this.quotationRepository.preload({
            id: id,
            ...updateQuotationDto,
        });
        if (!quotation) {
            throw new NotFoundException(`Quotation #${id} not found`);
        }
        return this.quotationRepository.save(quotation);
    }

    // --- Approval Workflow ---

    async submit(id: number, user: any) {
        const quotation = await this.findOne(id);

        if (quotation.status !== 'DRAFT' && quotation.status !== 'REJECTED') {
            throw new BadRequestException('Only DRAFT or REJECTED quotations can be submitted.');
        }

        // Allow Employee or PlantAdmin to submit
        if (user.role !== Role.EMPLOYEE && user.role !== Role.PLANT_ADMIN && user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('Only Employee or Plant Admin can submit quotations.');
        }

        // Update Status
        quotation.status = 'SUBMITTED';
        quotation.currentApproverRole = Role.PLANT_ADMIN;

        // Versioning on re-submit (if rejected previously)
        if (quotation.status === 'REJECTED') {
            quotation.version += 1;
        }

        await this.quotationRepository.save(quotation);
        await this.logApproval(id, 'SUBMITTED', user, 'Submitted for approval');
        return quotation;
    }

    async approve(id: number, user: any, remarks: string) {
        const quotation = await this.findOne(id);

        console.log(`Approving Quotation ID: ${id}, Current Status: ${quotation.status}, User Role: ${user.role}`);
        if (quotation.status !== 'DRAFT' && quotation.status !== 'SUBMITTED' && quotation.status !== 'PLANT_APPROVED') {
            throw new BadRequestException(`Quotation is not in an approvable state. Current status: ${quotation.status}`);
        }

        if (quotation.status === 'DRAFT' || quotation.status === 'SUBMITTED') {
            if (user.role !== Role.PLANT_ADMIN && user.role !== Role.SUPER_ADMIN) {
                throw new ForbiddenException('Only Plant Admin can approve at this stage.');
            }
            quotation.status = 'PLANT_APPROVED';
            quotation.currentApproverRole = Role.REGION_ADMIN;
        } else if (quotation.status === 'PLANT_APPROVED') {
            if (user.role !== Role.REGION_ADMIN && user.role !== Role.SUPER_ADMIN) {
                throw new ForbiddenException('Only Region Admin can approve at this stage.');
            }
            quotation.status = 'REGION_APPROVED';
            quotation.currentApproverRole = Role.SUPER_ADMIN;
        }

        await this.quotationRepository.save(quotation);
        await this.logApproval(id, 'APPROVED', user, remarks);
        return quotation;
    }

    async reject(id: number, user: any, remarks: string) {
        const quotation = await this.findOne(id);

        // Region Admin or Super Admin can reject
        if (user.role !== Role.REGION_ADMIN && user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('Not authorized to reject.');
        }

        quotation.status = 'REJECTED';
        quotation.currentApproverRole = Role.PLANT_ADMIN; // Back to drafter

        await this.quotationRepository.save(quotation);
        await this.logApproval(id, 'REJECTED', user, remarks);
        return quotation;
    }

    async finalApprove(id: number, user: any) {
        const quotation = await this.findOne(id);

        if (user.role !== Role.SUPER_ADMIN) {
            throw new ForbiddenException('Only Super Admin can give final approval.');
        }

        if (quotation.status !== 'REGION_APPROVED') {
            throw new BadRequestException('Quotation must be Region Approved first.');
        }

        quotation.status = 'FINAL_APPROVED';
        quotation.currentApproverRole = null; // Workflow complete

        await this.quotationRepository.save(quotation);
        await this.logApproval(id, 'FINAL_APPROVED', user, 'Final Approval Granted');
        return quotation;
    }

    async getApprovalHistory(id: number) {
        return this.approvalRepository.find({
            where: { quotationId: id },
            order: { timestamp: 'DESC' },
            relations: ['actionBy']
        });
    }

    private async logApproval(quotationId: number, action: string, user: any, remarks: string) {
        const log = this.approvalRepository.create({
            quotationId,
            action,
            actionById: user.id,
            role: user.role,
            remarks
        });
        await this.approvalRepository.save(log);
    }

    // --- Auto-Flow Logic ---

    async generateDraftQuotation(surveyId: number) {
        const survey = await this.surveyRepository.findOne({ where: { id: surveyId } });
        if (!survey) throw new NotFoundException('Survey not found');

        // 1. System Size Calculation
        // recommendedKW = (avgMonthlyUnits / 30 / sunlightHours) * efficiencyFactor
        const avgMonthlyUnits = survey.averageMonthlyUnits || 0;
        const sunlightHours = 5; // Configurable ideally
        const efficiencyFactor = 0.75; // Configurable
        // Avoid division by zero
        const recommendedKW = avgMonthlyUnits > 0 ? (avgMonthlyUnits / 30 / sunlightHours) * efficiencyFactor : 3; // Default 3kW

        // Round to nearest 0.5 or 1
        const finalKW = Math.ceil(recommendedKW * 2) / 2;

        // 2. Cost Calculation Engine (Estimates)
        const ratePerKW = {
            modules: 25000,
            inverter: 15000,
            structure: 5000,
            bos: 10000,
            installation: 5000,
            netMetering: 10000 // Fixed
        };

        const costSolarModules = finalKW * ratePerKW.modules;
        const costInverters = finalKW * ratePerKW.inverter;
        const costStructure = finalKW * ratePerKW.structure;
        const costBOS = finalKW * ratePerKW.bos;
        const costInstallation = finalKW * ratePerKW.installation;
        const costNetMetering = ratePerKW.netMetering;

        const totalProjectCost = costSolarModules + costInverters + costStructure + costBOS + costInstallation + costNetMetering;
        const subsidy = this.calculateSubsidy(finalKW, totalProjectCost);
        const netProjectCost = totalProjectCost - subsidy;

        // 3. Savings & ROI Engine
        const annualGeneration = finalKW * 1500; // 1500 units per kW per year
        const tariff = 8; // Rs 8 per unit default
        const annualSavings = annualGeneration * tariff;
        const paybackPeriod = annualSavings > 0 ? netProjectCost / annualSavings : 0;
        const savings25Years = annualSavings * 25;
        const irr = 15; // Placeholder IRR

        // Create Draft Quotation
        const quotation = this.quotationRepository.create({
            surveyId: survey.id,
            quotationNumber: `QT-${Date.now()}`,
            proposedSystemCapacity: finalKW,
            plantType: 'Grid-connected',
            annualEnergyGeneration: annualGeneration,
            monthlyAverageGeneration: annualGeneration / 12,
            cuf: 16,
            performanceRatio: 78,
            costSolarModules,
            costInverters,
            costStructure,
            costBOS,
            costInstallation,
            costNetMetering,
            totalProjectCost,
            governmentSubsidy: subsidy,
            netProjectCost,
            annualElectricitySavings: annualSavings,
            electricityTariff: tariff,
            paybackPeriod: parseFloat(paybackPeriod.toFixed(2)),
            savings25Years,
            irr,
            status: 'DRAFT',
            currentApproverRole: Role.EMPLOYEE,
            version: 1,
        });

        return this.quotationRepository.save(quotation);
    }

    private calculateSubsidy(kw: number, totalCost: number): number {
        // Simplified subsidy logic (PM Surya Ghar approx)
        if (kw <= 1) return 30000;
        if (kw <= 2) return 60000;
        if (kw <= 3) return 78000;
        return 78000; // Max for > 3kW
    }

    // --- PDF Generation ---
    async generatePdf(quotationId: number) {
        const quotation = await this.findOne(quotationId);

        // Detailed HTML Template mimicking the user's request
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.6; }
        .container { width: 100%; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #ed8936; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #ed8936; }
        .title { font-size: 28px; margin-top: 10px; color: #2d3748; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; color: #2d3748; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background-color: #f7fafc; font-weight: 600; color: #4a5568; }
        .highlight { color: #ed8936; font-weight: bold; }
        .total-row { font-size: 18px; font-weight: bold; background-color: #f7fafc; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        .page-break { page-break-after: always; }
    </style>
</head>
<body>
    <div class="container">
        <!-- 1. Cover Page -->
        <div class="header">
            <div class="logo">SOLARX</div>
            <div class="title">Solar Power System Proposal & Quotation</div>
            <p><strong>${quotation.quotationNumber}</strong> | Date: ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="section">
            <div class="section-title">2. Customer & Site Information</div>
            <table>
                <tr>
                    <td><strong>Customer Name:</strong></td>
                    <td>${quotation.survey?.customerName || 'N/A'}</td>
                </tr>
                <tr>
                    <td><strong>Site Address:</strong></td>
                    <td>${quotation.survey?.siteAddress || 'N/A'}, ${quotation.survey?.city || ''}</td>
                </tr>
                <tr>
                    <td><strong>Customer Type:</strong></td>
                    <td>${quotation.survey?.customerType || 'N/A'}</td>
                </tr>
                <tr>
                    <td><strong>DISCOM Name:</strong></td>
                    <td>${quotation.survey?.discomName || 'N/A'}</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="section-title">3. System Overview</div>
            <table>
                <tr>
                    <td><strong>Proposed System Capacity:</strong></td>
                    <td class="highlight">${quotation.proposedSystemCapacity} kW</td>
                </tr>
                <tr>
                    <td><strong>Plant Type:</strong></td>
                    <td>${quotation.plantType}</td>
                </tr>
                 <tr>
                    <td><strong>Roof Details:</strong></td>
                    <td>${quotation.survey?.roofType || 'N/A'}</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="section-title">4. Financial Summary</div>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Amount (&#8377;)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Solar Modules</td><td>&#8377;${quotation.costSolarModules}</td></tr>
                    <tr><td>Inverters</td><td>&#8377;${quotation.costInverters}</td></tr>
                    <tr><td>Structure</td><td>&#8377;${quotation.costStructure}</td></tr>
                    <tr><td>BOS (Cables, DBs)</td><td>&#8377;${quotation.costBOS}</td></tr>
                    <tr><td>Installation & Commissioning</td><td>&#8377;${quotation.costInstallation}</td></tr>
                    <tr><td>Net Metering Charges</td><td>&#8377;${quotation.costNetMetering}</td></tr>
                    <tr class="total-row">
                        <td>Total Project Cost</td>
                        <td class="highlight">&#8377;${quotation.totalProjectCost}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="section-title">5. Subsidy & Benefits</div>
            <table>
                <tr>
                    <td>Government Subsidy (Estimated):</td>
                    <td>&#8377;${quotation.governmentSubsidy}</td>
                </tr>
                <tr class="total-row">
                    <td>Net Project Cost:</td>
                    <td class="highlight">&#8377;${quotation.netProjectCost}</td>
                </tr>
            </table>
        </div>

        <div class="section">
             <div class="section-title">6. Savings & ROI Projection</div>
             <table>
                <tr><td>Annual Electricity Generation:</td><td>${quotation.annualEnergyGeneration} kWh</td></tr>
                <tr><td>Annual Savings:</td><td>&#8377;${quotation.annualElectricitySavings}</td></tr>
                <tr><td>Payback Period:</td><td>${quotation.paybackPeriod} Years</td></tr>
                <tr><td>25-Year Savings:</td><td>&#8377;${quotation.savings25Years}</td></tr>
             </table>
        </div>
        
        <div class="footer">
            <p>Terms & Conditions Apply. Valid for 15 days.</p>
        </div>
    </div>
</body>
</html>
        `;

        try {
            const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
            const page = await browser.newPage();
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
            const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
            await browser.close();

            // Return buffer as base64 or stream. For now, returning base64 to frontend to download.
            return {
                base64: Buffer.from(pdfBuffer).toString('base64'),
                filename: `Quotation_${quotation.quotationNumber}.pdf`
            };
        } catch (error) {
            console.error('PDF Generation Error:', error);
            // Fallback for dev if puppeteer fails
            return { error: 'Failed to generate PDF', details: error.message };
        }
    }
}
