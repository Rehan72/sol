import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

// Placeholders for related entities. Logic implies these exist or will exist.
// For now, I will define them as simple classes if they are not found, but since I am making the User entity to satisfy Auth Service,
// I will keep the relations simple or use 'any' if strict types are not critical right now, 
// OR better, I will assume simple structure for now to clear errors.

// However, the AuthService accesses user.region.id and user.plant.id.
// So I need to define simple relations or at least the structure.

import { Role } from '../common/enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: false })
  termAccepted: boolean;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  @Exclude()
  hashedRefreshToken: string;

  // Mocking relations for now to satisfy AuthService
  @Column({ type: 'jsonb', nullable: true })
  region: { id: string };

  @Column({ type: 'jsonb', nullable: true })
  plant: { id: string };

  // Onboarding Data
  @Column({ default: false })
  isOnboarded: boolean;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  pincode: string;

  @Column({ nullable: true })
  propertyType: string;

  @Column({ nullable: true })
  roofType: string;

  @Column({ type: 'float', nullable: true })
  roofArea: number;

  @Column({ nullable: true })
  billRange: string;

  @Column({ nullable: true })
  solarType: string;

  @Column({ default: 'PENDING' })
  installationStatus: string;

  @Column({ default: 'PENDING' })
  surveyStatus: string;

  @Column({ nullable: true })
  assignedSurveyTeam: string;
}
