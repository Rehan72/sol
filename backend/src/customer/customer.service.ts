import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Plant } from '../entities/plant.entity';
import { Team } from '../entities/team.entity';
import { CustomerOnboardingDto } from '../auth/dto/customerOnborading.dto';
import { Role } from '../common/enums/role.enum';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Plant) private plantRepo: Repository<Plant>,
    @InjectRepository(Team) private teamRepo: Repository<Team>,
    private auditService: AuditService
  ) { }

  // Haversine formula to calculate distance in km
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async findNearestPlant(lat: number, lng: number): Promise<Plant | null> {
    const plants = await this.plantRepo.find();
    if (plants.length === 0) return null;

    let nearestPlant: Plant | null = null;
    let minDistance = Infinity;

    for (const plant of plants) {
      if (plant.latitude && plant.longitude) {
        const distance = this.calculateDistance(lat, lng, Number(plant.latitude), Number(plant.longitude));
        if (distance < minDistance) {
          minDistance = distance;
          nearestPlant = plant;
        }
      }
    }
    return nearestPlant;
  }

  async onboardCustomer(userId: string, dto: CustomerOnboardingDto) {
    const updates: Partial<User> = {
      ...dto,
      isOnboarded: true,
      installationStatus: 'ONBOARDED',
    };

    // Assign nearest plant
    if (dto.latitude && dto.longitude) {
      const nearestPlant = await this.findNearestPlant(dto.latitude, dto.longitude);
      if (nearestPlant) {
        updates.plant = { id: nearestPlant.id };
        // Determine the region admin from the plant
        if (nearestPlant.regionAdminId) {
          updates.region = { id: nearestPlant.regionAdminId }; // Assuming region mapping via ID or similar
        }
      }
    }

    await this.usersRepo.update(userId, updates);
    return { message: 'Onboarding completed successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      // relations: ['plant'], // 'plant' is a jsonb column, not a relation
    });

    if (!user) return null;

    // Fetch full Plant details
    let plantDetails = null;
    if (user.plant?.id) {
      plantDetails = await this.plantRepo.findOneBy({ id: user.plant.id });
    }

    // Fetch Region Admin details
    let regionDetails = null;
    if (user.region?.id) {
      const regionAdmin = await this.usersRepo.findOneBy({ id: user.region.id });
      if (regionAdmin) {
        regionDetails = {
          id: regionAdmin.id,
          name: regionAdmin.name,
          email: regionAdmin.email,
          phone: regionAdmin.phone,
          regionName: regionAdmin.regionName, // Assuming the admin has this field
        };
      }
    }

    // Fetch Plant Admin details (already partially there, but refining)
    let plantAdminDetails = {};
    if (user.plant?.id) {
      const plantAdmin = await this.usersRepo.findOne({
        where: {
          role: Role.PLANT_ADMIN,
          plant: { id: user.plant.id } // This queries the jsonb column
        }
      });

      if (plantAdmin) {
        plantAdminDetails = {
          plantAdminName: plantAdmin.name,
          plantAdminPhone: plantAdmin.phone,
          plantAdminEmail: plantAdmin.email
        };
      }
    }

    // Fetch Survey Team details if assigned
    let surveyTeam = null;
    if (user.assignedSurveyTeam) {
      const team = await this.teamRepo.findOne({
        where: { name: user.assignedSurveyTeam },
        relations: ['teamLead']
      });

      if (team) {
        surveyTeam = {
          name: team.name,
          code: team.code,
          status: team.status,
          teamLead: team.teamLead ? {
            name: team.teamLead.name,
            phone: team.teamLead.phone,
            email: team.teamLead.email
          } : null
        };
      }
    }

    return {
      ...user,
      plantDetails,
      regionDetails,
      ...plantAdminDetails,
      surveyTeam
    };
  }

  async assignSurveyTeam(customerId: string, teamId: string, adminId: string) {
    const team = await this.teamRepo.findOne({ where: { id: teamId } });
    if (!team) {
      throw new Error('Team not found');
    }

    await this.usersRepo.update(customerId, {
      surveyStatus: 'ASSIGNED',
      assignedSurveyTeam: team.name,
      teamName: team.name, // Redundant but keeping for consistency if used elsewhere
    });

    // Log Audit
    await this.auditService.log(
      adminId,
      'STATUS_CHANGE',
      'Customer',
      customerId,
      'SURVEY',
      {
        oldValue: 'New Request',
        newValue: 'ASSIGNED',
        notes: `Assigned survey team: ${team.name}`
      }
    );

    return { message: 'Survey team assigned successfully', teamName: team.name };
  }

  async getSolarRequests(currentUser: User) {
    let query = this.usersRepo.createQueryBuilder('user')
      .where('user.role = :role', { role: Role.CUSTOMER })
      .andWhere('user.isOnboarded = :isOnboarded', { isOnboarded: true });

    if (currentUser.role === Role.PLANT_ADMIN) {
      // Plant Admin sees only customers assigned to their plant
      if (currentUser.plant?.id) {
        query = query.andWhere('user.plant ::jsonb @> :plant', { plant: { id: currentUser.plant.id } });
      } else {
        return []; // No plant assigned to this admin, so no customers
      }
    }
    // Super Admin sees all. Region Admin logic can be added here.

    const customers = await query.orderBy('user.id', 'DESC').getMany(); // Using ID for arbitrary ordering, createAt preferred if avail
    return customers;
  }

  async getAllCustomers(currentUser: User) {
    let query = this.usersRepo.createQueryBuilder('user')
      .where('user.role = :role', { role: Role.CUSTOMER });

    if (currentUser.role === Role.PLANT_ADMIN) {
      if (currentUser.plant?.id) {
        query = query.andWhere('user.plant ::jsonb @> :plant', { plant: { id: currentUser.plant.id } });
      } else {
        return [];
      }
    }
    // Region Admin logic can be added here

    return await query.orderBy('user.id', 'DESC').getMany();
  }
}
