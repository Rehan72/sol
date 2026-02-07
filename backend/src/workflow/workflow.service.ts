import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowStep } from '../entities/workflow-step.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class WorkflowService {
    constructor(
        @InjectRepository(WorkflowStep)
        private stepRepo: Repository<WorkflowStep>,
        private auditService: AuditService
    ) { }

    async initializeWorkflow(customerId: string, adminId: string) {
        // Define default steps
        const defaultSteps = [
            { phase: 'INSTALLATION', stepId: 'mounting', label: 'Mounting Structure' },
            { phase: 'INSTALLATION', stepId: 'inverter', label: 'Inverter Installation' },
            { phase: 'INSTALLATION', stepId: 'wiring', label: 'DC/AC Wiring' },
            { phase: 'INSTALLATION', stepId: 'inspection', label: 'QC Inspection' },
            { phase: 'COMMISSIONING', stepId: 'testing', label: 'System Testing' },
            { phase: 'COMMISSIONING', stepId: 'grid_sync', label: 'Grid Synchronization' },
        ];

        const steps = [];
        for (const step of defaultSteps) {
            const existing = await this.stepRepo.findOne({ where: { customerId, stepId: step.stepId } });
            if (!existing) {
                const newStep = this.stepRepo.create({
                    customerId,
                    phase: step.phase,
                    stepId: step.stepId,
                    label: step.label,
                    status: 'pending'
                });
                steps.push(await this.stepRepo.save(newStep));
            }
        }

        await this.auditService.log(adminId, 'CREATED', 'Workflow', customerId, 'INSTALLATION', { notes: 'Initialized installation workflow' });
        return steps;
    }

    async getWorkflow(customerId: string) {
        return this.stepRepo.find({ where: { customerId }, order: { createdAt: 'ASC' } });
    }

    async updateStepStatus(stepId: string, status: string, userId: string, notes?: string) {
        const step = await this.stepRepo.findOne({ where: { id: stepId }, relations: ['customer'] });
        if (!step) throw new Error('Step not found');

        const oldStatus = step.status;
        step.status = status;
        if (notes) step.notes = notes;
        step.assignedToId = userId; // Track who did it

        const updated = await this.stepRepo.save(step);

        // Audit Log
        await this.auditService.log(
            userId,
            'STEP_COMPLETED',
            step.label,
            step.id,
            step.phase,
            { oldValue: oldStatus, newValue: status, notes }
        );

        return updated;
    }
}
