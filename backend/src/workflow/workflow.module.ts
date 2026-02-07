import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { WorkflowStep } from '../entities/workflow-step.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([WorkflowStep]),
        AuditModule
    ],
    controllers: [WorkflowController],
    providers: [WorkflowService],
    exports: [WorkflowService],
})
export class WorkflowModule { }
