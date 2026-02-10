import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowStep } from '../entities/workflow-step.entity';
import { User } from '../entities/user.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class WorkflowService {
    constructor(
        @InjectRepository(WorkflowStep)
        private stepRepo: Repository<WorkflowStep>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
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

        // Delete existing duplicate steps for this customer (cleanup)
        const existingSteps = await this.stepRepo.find({ where: { customerId } });
        if (existingSteps.length > 0) {
            await this.stepRepo.remove(existingSteps);
        }

        const steps = [];
        for (const step of defaultSteps) {
            const newStep = this.stepRepo.create({
                customerId,
                phase: step.phase,
                stepId: step.stepId,
                label: step.label,
                status: 'pending'
            });
            steps.push(await this.stepRepo.save(newStep));
        }

        await this.auditService.log(adminId, 'CREATED', 'Workflow', customerId, 'INSTALLATION', { notes: 'Initialized installation workflow' });
        return steps;
    }

    async getWorkflow(customerId: string) {
        return this.stepRepo.find({ where: { customerId }, order: { createdAt: 'ASC' } });
    }

    async resetWorkflow(customerId: string, adminId: string) {
        // Delete all existing workflow steps for this customer
        const existingSteps = await this.stepRepo.find({ where: { customerId } });
        if (existingSteps.length > 0) {
            await this.stepRepo.remove(existingSteps);
        }
        
        // Reinitialize the workflow
        return this.initializeWorkflow(customerId, adminId);
    }

    async updateStepStatus(stepId: string, status: string, userId: string, notes?: string, technicalData?: any) {
        const step = await this.stepRepo.findOne({ where: { id: stepId }, relations: ['customer'] });
        if (!step) throw new Error('Step not found');

        const oldStatus = step.status;
        step.status = status;
        if (notes) step.notes = notes;
        if (technicalData) {
            step.metadata = { ...step.metadata, technicalData };
        }
        step.assignedToId = userId; // Track who did it

        const updated = await this.stepRepo.save(step);

        // Audit Log
        await this.auditService.log(
            userId,
            'STEP_COMPLETED',
            step.label,
            step.id,
            step.phase,
            { oldValue: oldStatus, newValue: status, notes, ...(technicalData && { technicalData }) } as any
        );

        return updated;
    }

    async advanceToPhase(customerId: string, nextPhase: string, adminId: string) {
        // Update all steps of the current phase to completed
        // and set first step of next phase to in_progress
        const currentSteps = await this.stepRepo.find({ 
            where: { customerId },
            order: { createdAt: 'ASC' }
        });

        // Find the current highest phase that's not completed
        const phaseOrder = ['SURVEY', 'INSTALLATION', 'COMMISSIONING', 'LIVE'];
        const currentPhaseIndex = phaseOrder.indexOf(nextPhase);

        // Complete all steps of the previous phases
        for (const step of currentSteps) {
            const stepPhaseIndex = phaseOrder.indexOf(step.phase);
            if (stepPhaseIndex < currentPhaseIndex && step.status !== 'completed') {
                step.status = 'completed';
                await this.stepRepo.save(step);
            }
        }

        // Initialize and set first step of the new phase to in_progress
        const nextPhaseSteps = currentSteps.filter(s => s.phase === nextPhase);
        if (nextPhaseSteps.length === 0) {
            // Create default steps for the new phase if they don't exist
            const defaultSteps = [
                { phase: 'INSTALLATION', stepId: 'mounting', label: 'Mounting Structure' },
                { phase: 'INSTALLATION', stepId: 'inverter', label: 'Inverter Installation' },
                { phase: 'INSTALLATION', stepId: 'wiring', label: 'DC/AC Wiring' },
                { phase: 'INSTALLATION', stepId: 'inspection', label: 'QC Inspection' },
                { phase: 'COMMISSIONING', stepId: 'testing', label: 'System Testing' },
                { phase: 'COMMISSIONING', stepId: 'grid_sync', label: 'Grid Synchronization' },
            ];

            for (const step of defaultSteps) {
                if (step.phase === nextPhase) {
                    const existing = await this.stepRepo.findOne({ 
                        where: { customerId, stepId: step.stepId, phase: step.phase } 
                    });
                    if (!existing) {
                        const newStep = this.stepRepo.create({
                            customerId,
                            phase: step.phase,
                            stepId: step.stepId,
                            label: step.label,
                            status: 'in_progress'
                        });
                        await this.stepRepo.save(newStep);
                    }
                }
            }
        } else {
            // Set first step of new phase to in_progress
            nextPhaseSteps[0].status = 'in_progress';
            await this.stepRepo.save(nextPhaseSteps[0]);
        }

        await this.auditService.log(
            adminId,
            'PHASE_ADVANCED',
            'Workflow',
            customerId,
            nextPhase,
            { notes: `Advanced to ${nextPhase} phase` }
        );

        // Update User Status
        try {
            const user = await this.userRepo.findOne({ where: { id: customerId } });
            if (user) {
                if (nextPhase === 'INSTALLATION') {
                    user.surveyStatus = 'COMPLETED';
                    user.installationStatus = 'IN_PROGRESS';
                } else if (nextPhase === 'COMMISSIONING') {
                    user.installationStatus = 'COMPLETED';
                }
                await this.userRepo.save(user);
            }
        } catch (error) {
            console.error('Failed to update user status during phase advancement:', error);
        }

        return { success: true, message: `Advanced to ${nextPhase} phase` };
    }

    async markInstallationComplete(customerId: string, adminId: string) {
        // Complete all INSTALLATION phase steps
        const steps = await this.stepRepo.find({ where: { customerId } });
        
        for (const step of steps) {
            if (step.phase === 'INSTALLATION' && step.status !== 'completed') {
                step.status = 'completed';
                await this.stepRepo.save(step);
            }
        }

        // Update User Status to INSTALLATION_COMPLETED (consistent with customer service)
        const user = await this.userRepo.findOne({ where: { id: customerId } });
        if (user) {
            user.installationStatus = 'INSTALLATION_COMPLETED';
            await this.userRepo.save(user);
        }

        await this.auditService.log(
            adminId,
            'INSTALLATION_COMPLETED',
            'Workflow',
            customerId,
            'INSTALLATION',
            { notes: 'Installation marked as completed' }
        );

        return { success: true, message: 'Installation marked as completed' };
    }
}
