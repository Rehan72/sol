import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowStep } from '../entities/workflow-step.entity';
import { User } from '../entities/user.entity';
import { Payment } from '../entities/payment.entity';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType, NotificationChannel } from '../entities/notification.entity';

@Injectable()
export class WorkflowService {
    constructor(
        @InjectRepository(WorkflowStep)
        private stepRepo: Repository<WorkflowStep>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Payment)
        private paymentRepo: Repository<Payment>,
        private auditService: AuditService,
        private notificationsService: NotificationsService
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
        if (!step) throw new NotFoundException('Step not found');

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
            if (stepPhaseIndex < currentPhaseIndex && step.status !== 'completed' && step.status !== 'qc_approved') {
                 // Special handling for Installation phase completion which might be 'qc_approved'
                step.status = 'completed';
                await this.stepRepo.save(step);
            }
        }

        // Strict Phase Transition Checks
        if (nextPhase === 'INSTALLATION') {
            const user = await this.userRepo.findOne({ where: { id: customerId } });
            if (!user || user.surveyStatus !== 'APPROVED') {
                throw new BadRequestException('Survey must be APPROVED before starting Installation.');
            }
        }

        if (nextPhase === 'COMMISSIONING') {
            const user = await this.userRepo.findOne({ where: { id: customerId } });
             // Ensure Installation is QC_APPROVED or INSTALLATION_COMPLETED. 
            if (!user || !['QC_APPROVED', 'INSTALLATION_COMPLETED'].includes(user.installationStatus)) {
                throw new BadRequestException('Installation must be QC APPROVED before starting Commissioning.');
            }
        }

        if (nextPhase === 'LIVE') {
            // 1. Check if all commissioning steps are completed
            const commissioningSteps = currentSteps.filter(s => s.phase === 'COMMISSIONING');
            const allCommissioningDone = commissioningSteps.length > 0 && commissioningSteps.every(s => s.status === 'completed');
            if (!allCommissioningDone) {
                throw new BadRequestException('All commissioning steps must be completed before going live.');
            }

            // 2. Check if all 4 payment milestones are COMPLETED
            const paidMilestones = await this.paymentRepo.find({
                where: { customerId, status: 'COMPLETED' }
            });
            const milestoneIds = paidMilestones.map(p => p.milestoneId);
            const requiredMilestones = ['M1', 'M2', 'M3', 'M4'];
            const missingPayments = requiredMilestones.filter(m => !milestoneIds.includes(m));

            if (missingPayments.length > 0) {
                throw new BadRequestException(`Pending payments for milestones: ${missingPayments.join(', ')}. All payments must be cleared before going live.`);
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
                    user.installationStatus = 'COMMISSIONING';
                } else if (nextPhase === 'LIVE') {
                    user.installationStatus = 'COMPLETED';
                }
                await this.userRepo.save(user);

                // Send Notification
                const phaseMessages = {
                    'INSTALLATION': { title: 'Installation Started! 🛠️', msg: 'Your solar installation phase has officially begun. Our team is on it!' },
                    'COMMISSIONING': { title: 'Commissioning Phase! ⚡', msg: 'Installation is complete. We are now testing and synchronizing your system with the grid.' },
                    'LIVE': { title: 'Congratulations! You are LIVE! 🌞', msg: 'Your solar plant is now fully operational and generating green energy.' }
                };

                if (phaseMessages[nextPhase]) {
                    await this.notificationsService.send(
                        customerId,
                        phaseMessages[nextPhase].title,
                        phaseMessages[nextPhase].msg,
                        NotificationType.SUCCESS,
                        [NotificationChannel.SYSTEM]
                    );
                }
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

    async assignInstallationTeam(customerId: string, teamId: string, adminId: string) {
        const user = await this.userRepo.findOne({ where: { id: customerId } });
        if (!user) throw new NotFoundException('User not found');
        
        user.assignedInstallationTeam = teamId;
        user.installationStatus = 'TEAM_ASSIGNED';
        await this.userRepo.save(user);

         await this.auditService.log(
            adminId,
            'TEAM_ASSIGNED',
            'Workflow',
            customerId,
            'INSTALLATION',
            { notes: `Assigned Installation Team: ${teamId}` }
        );
        return user;
    }

    async requestInstallationQC(customerId: string, userId: string) {
        // Check if all installation steps (except final inspection) are completed
        const steps = await this.stepRepo.find({ where: { customerId, phase: 'INSTALLATION' } });
        const installationWorkDone = steps.length > 0 && steps
            .filter(s => s.stepId !== 'inspection')
            .every(s => s.status === 'completed');
        
        if (!installationWorkDone) {
            throw new BadRequestException('All installation steps must be completed before requesting QC.');
        }

        const user = await this.userRepo.findOne({ where: { id: customerId } });
        if (!user) throw new NotFoundException('User not found');
        
        user.installationStatus = 'QC_PENDING';
        await this.userRepo.save(user);
        
         await this.auditService.log(
            userId,
            'QC_REQUESTED',
            'Workflow',
            customerId,
            'INSTALLATION',
            { notes: 'Installation QC Requested' }
        );

        return { success: true, message: 'QC Requested' };
    }

     async approveInstallationQC(customerId: string, adminId: string) {
        const user = await this.userRepo.findOne({ where: { id: customerId } });
        if (user) {
            user.installationStatus = 'QC_APPROVED';
            await this.userRepo.save(user);
        }
        
         await this.auditService.log(
            adminId,
            'QC_APPROVED',
            'Workflow',
            customerId,
            'INSTALLATION',
            { notes: 'Installation QC Approved' }
        );

        return { success: true, message: 'QC Approved' };
    }

    async rejectInstallationQC(customerId: string, adminId: string, reason: string) {
        const user = await this.userRepo.findOne({ where: { id: customerId } });
        if (user) {
            user.installationStatus = 'IN_PROGRESS'; // Revert to In Progress for fixes
            await this.userRepo.save(user);
        }

         await this.auditService.log(
            adminId,
            'QC_REJECTED',
            'Workflow',
            customerId,
            'INSTALLATION',
            { notes: `Installation QC Rejected: ${reason}` }
        );

        return { success: true, message: 'QC Rejected' };
    }
}
