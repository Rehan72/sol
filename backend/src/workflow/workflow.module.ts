import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { WorkflowStep } from '../entities/workflow-step.entity';
import { User } from '../entities/user.entity';
import { Payment } from '../entities/payment.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([WorkflowStep, User, Payment]),
        AuditModule
    ],
    controllers: [WorkflowController],
    providers: [WorkflowService],
    exports: [WorkflowService],
})
export class WorkflowModule { }
