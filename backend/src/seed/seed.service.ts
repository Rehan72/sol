import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { Plant } from '../entities/plant.entity';
import { Quotation } from '../entities/quotation.entity';
import { Ticket } from '../entities/ticket.entity';
import { GenerationLog } from '../entities/generation-log.entity';
import { Survey } from '../entities/survey.entity';
import { Team } from '../entities/team.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Plant) private readonly plantRepo: Repository<Plant>,
    @InjectRepository(Quotation) private readonly quotationRepo: Repository<Quotation>,
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(GenerationLog) private readonly logRepo: Repository<GenerationLog>,
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
    @InjectRepository(Survey) private readonly surveyRepo: Repository<Survey>,
  ) { }

  async onModuleInit() {
    // Seed service disabled - uncomment to enable
    await this.createSuperAdmin();
    // await this.createGridPlantUser();
    // await this.seedPlants();
    // await this.seedTeams();
    // await this.seedCustomers();
    // await this.seedQuotations();
    // await this.seedTickets();
    // await this.seedTelemetry();
  }

  private async createGridPlantUser() {
    const email = 'anik@gmail.com';
    const password = 'Anik@123';

    // Check if user exists
    const exists = await this.userRepo.findOne({ where: { email } });
    if (exists) {
        // console.log('✅ GridPlant user already exists');
        return;
    }

    // Find a plant to associate
    const plant = await this.plantRepo.findOne({ order: { createdAt: 'ASC' } });
    if (!plant) {
        this.logger.warn('⚠️ No plants found to associate with GridPlant user. Seeding plants first...');
        await this.seedPlants();
        return this.createGridPlantUser(); // Retry
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
        name: 'Anik Grid Owner',
        email,
        password: hashedPassword,
        phone: '+919876543210',
        role: Role.PLANTS, 
        plant: { id: plant.id },
        isOnboarded: true
    });

    await this.userRepo.save(user);
    this.logger.log(`🚀 GridPlant user '${email}' created for plant '${plant.plantName}'`);
  }

  private async createSuperAdmin() {
    const email = process.env.SUPERADMIN_EMAIL;
    const password = process.env.SUPERADMIN_PASSWORD;

    const exists = await this.userRepo.findOne({
      where: { email },
    });

    if (exists) {
      // console.log('✅ SuperAdmin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = this.userRepo.create({
      name: 'Super Admin',
      email,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    });

    await this.userRepo.save(superAdmin);
    this.logger.log('🚀 Default SuperAdmin created');
  }

  private async seedPlants() {
    const count = await this.plantRepo.count();
    if (count > 0) return;

    const plants = [
      { name: 'Solaris Alpha', code: 'SOL-ALPHA-001', location: 'Mumbai, MH', capacity: 1200, lat: 19.0760, lng: 72.8777 },
      { name: 'Helios One', code: 'HEL-ONE-001', location: 'Pune, MH', capacity: 850, lat: 18.5204, lng: 73.8567 },
      { name: 'RayGuard Plant', code: 'RAY-PLT-001', location: 'Bangalore, KA', capacity: 2100, lat: 12.9716, lng: 77.5946 },
      { name: 'Photon Valley', code: 'PHV-VAL-001', location: 'Hyderabad, TS', capacity: 1500, lat: 17.3850, lng: 78.4867 },
      { name: 'SunStrike Facility', code: 'SUN-STR-001', location: 'Chennai, TN', capacity: 3200, lat: 13.0827, lng: 80.2707 },
    ];

    for (const p of plants) {
      await this.plantRepo.save(this.plantRepo.create({
        plantName: p.name,
        plantCode: p.code,
        location: p.location,
        capacity: p.capacity,
        latitude: p.lat,
        longitude: p.lng,
        status: 'active',
        plantType: 'grid_connected',
        country: 'India',
        state: p.location.split(', ')[1],
        city: p.location.split(', ')[0],
        ownerName: 'Solar Owner',
        ownerPhone: '+91-9876543210',
        ownerEmail: 'owner@solar.com'
      }));
    }
    this.logger.log(`🌱 Seeded ${plants.length} plants`);
  }

  private async seedTeams() {
    const count = await this.teamRepo.count();
    if (count > 0) return;

    const plants = await this.plantRepo.find();
    if (plants.length === 0) return;

    for (const plant of plants) {
      const teams = [
        { name: `${plant.plantName} - Survey Alpha`, type: 'SURVEY' },
        { name: `${plant.plantName} - Install Bravo`, type: 'INSTALLATION' }
      ];

      for (const t of teams) {
        await this.teamRepo.save(this.teamRepo.create({
          name: t.name,
          type: t.type,
          status: 'ACTIVE',
          code: `TM-${Math.floor(Math.random() * 1000)}`,
          plant: { id: plant.id } // Correct relation mapping
        }));
      }
    }
    this.logger.log(`🛠️ Seeded teams for plants`);
  }

  private async seedCustomers() {
     // Only seed if limited customers exist
     const count = await this.userRepo.count({ where: { role: Role.CUSTOMER } });
     if (count > 5) return;

     const plants = await this.plantRepo.find();
     const password = await bcrypt.hash('customer123', 10);

     const statuses = ['ONBOARDED', 'SURVEY_ASSIGNED', 'QUOTATION_READY', 'INSTALLATION_SCHEDULED', 'INSTALLATION_COMPLETED', 'COMPLETED'];
     
     for (let i = 1; i <= 20; i++) {
        const plant = plants[i % plants.length];
        const status = statuses[i % statuses.length];
        
        let surveyStatus = 'PENDING';
        let installStatus = 'ONBOARDED';

        if (status === 'SURVEY_ASSIGNED') surveyStatus = 'ASSIGNED';
        if (status === 'QUOTATION_READY') surveyStatus = 'COMPLETED'; // Quotation implies survey done
        if (['INSTALLATION_SCHEDULED', 'INSTALLATION_COMPLETED', 'COMPLETED'].includes(status)) {
            surveyStatus = 'APPROVED';
            installStatus = status; 
            if(status === 'QUOTATION_READY') installStatus = 'INSTALLATION_READY'; // Correction
        }

        await this.userRepo.save(this.userRepo.create({
            name: `Customer ${i}`,
            email: `customer${i}@example.com`,
            password,
            role: Role.CUSTOMER,
            phone: `98765432${i.toString().padStart(2, '0')}`,
            city: plant.location.split(',')[0],
            state: plant.location.split(',')[1].trim(),
            plant: { id: plant.id }, // Correct relation
            isOnboarded: true,
            surveyStatus,
            installationStatus: installStatus,
            roofArea: 500 + Math.random() * 1000
        }));
     }
     this.logger.log('👥 Seeded 20 customers');
  }

  private async seedQuotations() {
      const customers = await this.userRepo.find({ where: { role: Role.CUSTOMER } });
      
      for (const customer of customers) {
          if (['COMPLETED', 'APPROVED'].includes(customer.surveyStatus)) {
              // Create survey if missing
              let survey = await this.surveyRepo.findOne({ where: { customerEmail: customer.email } });
              if (!survey) {
                  survey = await this.surveyRepo.save(this.surveyRepo.create({
                      customerId: customer.id,
                      customerEmail: customer.email,
                      status: 'COMPLETED'
                  }));
              }

              // Create quotation
              const exists = await this.quotationRepo.findOne({ where: { survey: { id: survey.id } } });
              if (!exists) {
                  const capacity = Math.floor(3 + Math.random() * 7); // 3-10 kW
                  const total = capacity * 55000;
                  
                  await this.quotationRepo.save(this.quotationRepo.create({
                      survey: { id: survey.id },
                      quotationNumber: `QT-${Date.now()}-${customer.id.substring(0,4)}`,
                      proposedSystemCapacity: capacity,
                      totalProjectCost: total,
                      netProjectCost: total,
                      status: 'FINAL_APPROVED',
                      validityDate: new Date(Date.now() + 86400000 * 30),
                      createdAt: new Date(),
                      costSolarModules: total * 0.4,
                      costInverters: total * 0.2,
                      costStructure: total * 0.1,
                      costBOS: total * 0.1,
                      costInstallation: total * 0.2
                  }));
              }
          }
      }
      this.logger.log('💰 Seeded quotations');
  }

  private async seedTickets() {
      const plants = await this.plantRepo.find();
      if (await this.ticketRepo.count() > 0) return;

      const types = ['HARDWARE_FAULT', 'CONNECTIVITY_ISSUE', 'PERFORMANCE_DEGRADATION'];
      
      for (const plant of plants) {
          if (Math.random() > 0.7) { // 30% chance of ticket
             const title = `${types[Math.floor(Math.random() * types.length)]} at ${plant.plantName}`;
             await this.ticketRepo.save(this.ticketRepo.create({
                 ticketNumber: `TKT-${Math.floor(Math.random() * 10000)}`,
                 description: `${title}. Automated system alert. Please investigate.`,
                 status: 'OPEN',
                 plant: { id: plant.id },
                 createdAt: new Date()
             }));
          }
      }
      this.logger.log('🎫 Seeded tickets');
  }

  private async seedTelemetry() {
      const plants = await this.plantRepo.find();
      const now = new Date();
      
      for (const plant of plants) {
          const count = await this.logRepo.count({ where: { plantId: plant.id } });
          if (count > 0) continue;

          const logs = [];
          for (let i = 0; i < 24 * 4; i++) { // 15 min intervals for 24h
              const time = new Date(now.getTime() - (i * 15 * 60 * 1000));
              const hour = time.getHours();
              
              // Solar curve
              let efficiency = 0;
              let kw = 0;
              let irradiance = 0;

              if (hour >= 6 && hour <= 18) {
                  const x = (hour - 6) / 12; // 0 to 1
                  const curve = Math.sin(x * Math.PI);
                  
                  irradiance = 1000 * curve * (0.8 + Math.random() * 0.2);
                  efficiency = 18 + Math.random() * 4; // 18-22%
                  kw = (plant.capacity * efficiency / 100) * (irradiance / 1000);
              }

              logs.push(this.logRepo.create({
                  plantId: plant.id,
                  timestamp: time,
                  kwGeneration: parseFloat(kw.toFixed(2)),
                  efficiency: parseFloat(efficiency.toFixed(1)),
                  irradiance: parseFloat(irradiance.toFixed(1)),
                  ambientTemp: 25 + Math.random() * 10,
                  moduleTemp: 30 + Math.random() * 20
              }));
          }
          await this.logRepo.save(logs);
      }
      this.logger.log('📈 Seeded telemetry data');
  }
}
