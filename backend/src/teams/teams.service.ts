import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Team } from '../entities/team.entity';
import { TeamMember } from '../entities/team-member.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class TeamsService {
    constructor(
        @InjectRepository(Team)
        private teamsRepository: Repository<Team>,
        @InjectRepository(TeamMember)
        private teamMembersRepository: Repository<TeamMember>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createTeamDto: any) {
        const { teamLeadId, customerId, members, ...teamData } = createTeamDto;

        // Check if team code is unique
        const existingTeam = await this.teamsRepository.findOne({ where: { code: teamData.code } });
        if (existingTeam) {
            throw new BadRequestException('Team code must be unique');
        }

        const team = this.teamsRepository.create(teamData as DeepPartial<Team>);

        if (teamLeadId) {
            const lead = await this.usersRepository.findOne({ where: { id: teamLeadId } });
            if (!lead) {
                throw new NotFoundException(`Team Lead with ID ${teamLeadId} not found`);
            }
            team.teamLead = lead;
        }

        if (customerId) {
            const customer = await this.usersRepository.findOne({ where: { id: customerId } });
            if (!customer) {
                throw new NotFoundException(`Customer with ID ${customerId} not found`);
            }
            team.customer = customer;
        }


        // Save team first to get ID
        const savedTeam = await this.teamsRepository.save(team);

        // Add members
        if (members && members.length > 0) {
            for (const member of members) {
                const user = await this.usersRepository.findOne({ where: { id: member.userId } });
                if (user) {
                    const newMember = this.teamMembersRepository.create({
                        team: savedTeam,
                        user: user,
                        role: member.role,
                    });
                    await this.teamMembersRepository.save(newMember);
                }
            }
        }

        return this.findOne(savedTeam.id);
    }

    async findAll(query: any) {
        const where: any = {};
        if (query.type) {
            where.type = query.type;
        }
        if (query.status) {
            where.status = query.status;
        }

        const teams = await this.teamsRepository.find({
            where,
            relations: ['teamLead', 'members', 'members.user', 'customer'],
            order: { createdAt: 'DESC' }
        });

        // Transform to include member count efficiently if needed, but relation is fine for now
        return teams.map(team => ({
            ...team,
            membersCount: team.members.length
        }));
    }

    async findOne(id: string) {
        const team = await this.teamsRepository.findOne({
            where: { id },
            relations: ['teamLead', 'members', 'members.user', 'customer'],
        });
        if (!team) {
            throw new NotFoundException(`Team with ID ${id} not found`);
        }
        return team;
    }

    async update(id: string, updateTeamDto: any) {
        const team = await this.findOne(id);
        const { teamLeadId, customerId, members, ...updateData } = updateTeamDto;

        // Update basic fields
        Object.assign(team, updateData);

        // Update Team Lead
        if (teamLeadId && teamLeadId !== team.teamLeadId) {
            const lead = await this.usersRepository.findOne({ where: { id: teamLeadId } });
            if (!lead) throw new NotFoundException(`Team Lead with ID ${teamLeadId} not found`);
            team.teamLead = lead;
        }

        // Update Customer
        if (customerId && customerId !== team.customerId) {
            const customer = await this.usersRepository.findOne({ where: { id: customerId } });
            if (!customer) throw new NotFoundException(`Customer with ID ${customerId} not found`);
            team.customer = customer;
        }

        const savedTeam = await this.teamsRepository.save(team);

        // Update Members (Full replacement strategy for simplicity, or add/remove logic)
        // For now, if members array is provided, we replace all members.
        if (members) {
            // Remove existing members
            await this.teamMembersRepository.delete({ teamId: id });

            // Add new members
            for (const member of members) {
                const user = await this.usersRepository.findOne({ where: { id: member.userId } });
                if (user) {
                    const newMember = this.teamMembersRepository.create({
                        team: savedTeam,
                        user: user,
                        role: member.role,
                    });
                    await this.teamMembersRepository.save(newMember);
                }
            }
        }

        return this.findOne(id);
    }

    async remove(id: string) {
        const team = await this.findOne(id);
        return this.teamsRepository.remove(team);
    }
}
