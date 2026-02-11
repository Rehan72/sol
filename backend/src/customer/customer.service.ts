import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../entities/user.entity';
import { Plant } from '../entities/plant.entity';
import { Team } from '../entities/team.entity';
import { Quotation } from '../entities/quotation.entity';
import { CustomerOnboardingDto } from '../auth/dto/customerOnborading.dto';
import { Role } from '../common/enums/role.enum';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Plant) private plantRepo: Repository<Plant>,
    @InjectRepository(Team) private teamRepo: Repository<Team>,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Quotation) private quotationRepo: Repository<Quotation>,
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
    });

    if (!user) return null;

    return this.formatCustomerResponse(user);
  }

  async getCustomerById(customerId: string) {
    const user = await this.usersRepo.findOne({
      where: { id: customerId },
    });

    if (!user) return null;

    return this.formatCustomerResponse(user);
  }

  private async formatCustomerResponse(user: User) {
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
          regionName: regionAdmin.regionName,
        };
      }
    }

    // Fetch Plant Admin details
    let plantAdminDetails = {};
    if (user.plant?.id) {
      const plantAdmin = await this.usersRepo.findOne({
        where: {
          role: Role.PLANT_ADMIN,
          plant: { id: user.plant.id }
        }
      });

      if (plantAdmin) {
        plantAdminDetails = {
          plantAdminId: plantAdmin.id,
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

    // Fetch latest Approved Quotation
    let quotation = null;
    const approvedQuotation = await this.quotationRepo.findOne({
      where: {
        survey: { customerEmail: user.email },
        status: In(['PLANT_APPROVED', 'REGION_APPROVED', 'FINAL_APPROVED'])
      },
      order: { createdAt: 'DESC' },
      relations: ['survey']
    });

    if (approvedQuotation) {
      quotation = {
        id: approvedQuotation.id,
        quotationNumber: approvedQuotation.quotationNumber,
        capacity: `${approvedQuotation.proposedSystemCapacity} kW`,
        total: approvedQuotation.totalProjectCost,
        subsidy: approvedQuotation.governmentSubsidy,
        final: approvedQuotation.netProjectCost,
        status: approvedQuotation.status,
        paymentStatus: approvedQuotation.paymentStatus || {
          solarModules: 'DUE',
          inverters: 'DUE',
          structure: 'DUE',
          bos: 'DUE',
          installation: 'DUE'
        },
        breakdown: [
          {
            id: 'solarModules',
            item: 'Solar Modules',
            cost: approvedQuotation.costSolarModules,
            status: approvedQuotation.paymentStatus?.solarModules || 'DUE'
          },
          {
            id: 'inverters',
            item: 'Inverters',
            cost: approvedQuotation.costInverters,
            status: approvedQuotation.paymentStatus?.inverters || 'DUE'
          },
          {
            id: 'structure',
            item: 'Structure & Hardware',
            cost: approvedQuotation.costStructure,
            status: approvedQuotation.paymentStatus?.structure || 'DUE'
          },
          {
            id: 'bos',
            item: 'Balance of System',
            cost: approvedQuotation.costBOS,
            status: approvedQuotation.paymentStatus?.bos || 'DUE'
          },
          {
            id: 'installation',
            item: 'Installation',
            cost: approvedQuotation.costInstallation,
            status: approvedQuotation.paymentStatus?.installation || 'DUE'
          }
        ]
      };
    }

    return {
      ...user,
      plantDetails,
      regionDetails,
      ...plantAdminDetails,
      surveyTeam,
      quotation
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
      teamName: team.name,
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
    let sql = `
      SELECT DISTINCT ON (u.id)
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.phone AS user_phone,
        u.city AS user_city,
        u.state AS user_state,
        u."propertyType" AS "user_propertyType",
        u."billRange" AS "user_billRange",
        u."installationStatus" AS "user_installationStatus",
        u."surveyStatus" AS "user_surveyStatus",
        u."createdAt" AS "user_createdAt",
        q.id AS "latestQuotationId",
        q.status AS "latestQuotationStatus"
      FROM users u
      LEFT JOIN surveys s ON s."customerEmail" = u.email
      LEFT JOIN quotations q ON q."surveyId" = s.id
      WHERE u.role = $1 AND u."isOnboarded" = $2
    `;

    const params: any[] = [Role.CUSTOMER, true];

    if (currentUser.role === Role.PLANT_ADMIN) {
      if (currentUser.plant?.id) {
        sql += ` AND u.plant->>'id' = $3`;
        params.push(currentUser.plant.id);
      } else {
        return [];
      }
    }

    sql += ` ORDER BY u.id, q.id DESC`;

    const rawData = await this.usersRepo.manager.query(sql, params);
    
    // Map raw data to object structure
    return rawData.map(item => ({
      id: item.user_id,
      name: item.user_name,
      email: item.user_email,
      phone: item.user_phone,
      city: item.user_city,
      state: item.user_state,
      propertyType: item.user_propertyType,
      billRange: item.user_billRange,
      installationStatus: item.user_installationStatus,
      surveyStatus: item.user_surveyStatus,
      createdAt: item.user_createdAt,
      latestQuotationStatus: item.latestQuotationStatus,
      latestQuotationId: item.latestQuotationId
    }));
  }

  async getAllCustomers(currentUser: User) {
    let sql = `
      SELECT DISTINCT ON (u.id)
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.phone AS user_phone,
        u.city AS user_city,
        u.state AS user_state,
        u.country AS user_country,
        u.pincode AS user_pincode,
        u."installationStatus" AS "user_installationStatus",
        u."surveyStatus" AS "user_surveyStatus",
        q.status AS "latestQuotationStatus"
      FROM users u
      LEFT JOIN surveys s ON s."customerEmail" = u.email
      LEFT JOIN quotations q ON q."surveyId" = s.id
      WHERE u.role = $1
    `;

    const params: any[] = [Role.CUSTOMER];

    if (currentUser.role === Role.PLANT_ADMIN) {
      if (currentUser.plant?.id) {
        sql += ` AND u.plant->>'id' = $2`;
        params.push(currentUser.plant.id);
      } else {
        return [];
      }
    }

    sql += ` ORDER BY u.id, q.id DESC`;

    const rawData = await this.usersRepo.manager.query(sql, params);

    return rawData.map(item => ({
      id: item.user_id,
      name: item.user_name,
      email: item.user_email,
      phone: item.user_phone,
      city: item.user_city,
      state: item.user_state,
      country: item.user_country,
      pincode: item.user_pincode,
      installationStatus: item.user_installationStatus,
      surveyStatus: item.user_surveyStatus,
      latestQuotationStatus: item.latestQuotationStatus
    }));
  }

  async assignInstallationTeam(customerId: string, teamId: string, startDate: string, adminId: string) {
    const team = await this.teamRepo.findOne({ where: { id: teamId } });
    if (!team) {
      throw new Error('Team not found');
    }

    await this.usersRepo.update(customerId, {
      installationStatus: 'INSTALLATION_SCHEDULED',
      assignedInstallationTeam: team.name,
      installationStartDate: startDate ? new Date(startDate) : new Date(),
    });

    // Log Audit
    await this.auditService.log(
      adminId,
      'STATUS_CHANGE',
      'Customer',
      customerId,
      'INSTALLATION',
      {
        oldValue: 'Pending',
        newValue: 'INSTALLATION_SCHEDULED',
        notes: `Assigned installation team: ${team.name}`
      }
    );

    return { 
      message: 'Installation team assigned successfully', 
      teamName: team.name,
      status: 'INSTALLATION_SCHEDULED'
    };
  }

  async updateInstallationStatus(customerId: string, status: string) {
    const validStatuses = [
      'INSTALLATION_SCHEDULED',
      'INSTALLATION_STARTED',
      'INSTALLATION_COMPLETED',
      'COMMISSIONING',
      'COMPLETED'
    ];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid installation status');
    }

    await this.usersRepo.update(customerId, {
      installationStatus: status,
    });

    return { message: 'Installation status updated', status };
  }

  async markInstallationReady(customerId: string, adminId: string) {
    // Update installation status to indicate ready for installation scheduling
    await this.usersRepo.update(customerId, {
      installationStatus: 'INSTALLATION_READY',
    });

    // Log Audit
    await this.auditService.log(
      adminId,
      'STATUS_CHANGE',
      'Customer',
      customerId,
      'INSTALLATION',
      {
        oldValue: 'Pending',
        newValue: 'INSTALLATION_READY',
        notes: 'Payment received, installation ready for scheduling'
      }
    );

    return { message: 'Customer marked as ready for installation' };
  }
}
