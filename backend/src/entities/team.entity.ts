import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { TeamMember } from './team-member.entity';

@Entity('teams')
export class Team {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    code: string;

    @Column()
    type: string; // SURVEY, INSTALLATION, MAINTENANCE

    @Column({ default: 'active' })
    status: string; // active, inactive

    @Column({ type: 'jsonb', nullable: true })
    plant: { id: string };

    // Relation to Customer (User)
    @Column({ nullable: true })
    customerId: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'customerId' })
    customer: User;

    // Team Lead
    @Column({ nullable: true })
    teamLeadId: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'teamLeadId' })
    teamLead: User;

    @OneToMany(() => TeamMember, (member) => member.team)
    members: TeamMember[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
