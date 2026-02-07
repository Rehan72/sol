import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Team } from './team.entity';
import { User } from './user.entity';

@Entity('team_members')
export class TeamMember {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    teamId: string;

    @ManyToOne(() => Team, (team) => team.members, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'teamId' })
    team: Team;

    @Column()
    userId: string;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    role: string; // Surveyor, Installer, Supervisor, Engineer, etc.
}
