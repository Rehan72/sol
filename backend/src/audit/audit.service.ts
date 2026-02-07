import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditService {
    constructor(
        @InjectRepository(AuditLog)
        private auditRepo: Repository<AuditLog>,
    ) { }

    async log(
        userId: string,
        action: string,
        entity: string,
        entityId: string,
        phase?: string,
        details?: { oldValue?: string; newValue?: string; notes?: string }
    ) {
        const log = this.auditRepo.create({
            performedBy: { id: userId }, // Assumes relation logic handles ID only insert
            performedById: userId,
            action,
            entity,
            entityId,
            phase,
            oldValue: details?.oldValue,
            newValue: details?.newValue,
            notes: details?.notes,
        });
        return this.auditRepo.save(log);
    }

    async findAll(phase?: string, action?: string) {
        const query = this.auditRepo.createQueryBuilder('audit')
            .leftJoinAndSelect('audit.performedBy', 'user')
            .orderBy('audit.timestamp', 'DESC');

        if (phase && phase !== 'ALL') {
            query.andWhere('audit.phase = :phase', { phase });
        }

        if (action && action !== 'ALL') {
            query.andWhere('audit.action = :action', { action });
        }

        // Select specific fields to avoid leaking sensitive user data if needed
        // For now returning full user object but in prod might want to select only name/role

        return query.getMany();
    }
}
