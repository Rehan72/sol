import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { CustomerModule } from './customer/customer.module';
import { RegionAdminModule } from './regionAdmin/regionAdmin.module';
import { PlantModule } from './plant/plant.module';
import { PlantAdminModule } from './plantAdmin/plantAdmin.module';
import { EmployeesModule } from './employees/employees.module';
import { TeamsModule } from './teams/teams.module';
import { AuditModule } from './audit/audit.module';
import { WorkflowModule } from './workflow/workflow.module';
import { SurveysModule } from './surveys/surveys.module';
import { QuotationsModule } from './quotations/quotations.module';
import { PaymentsModule } from './payments/payments.module';
import { TicketsModule } from './tickets/tickets.module';
import { CostEstimationModule } from './cost-estimation/cost-estimation.module';
import { NotificationsModule } from './notifications/notifications.module';
import { InventoryModule } from './inventory/inventory.module';
import { PricingModule } from './pricing/pricing.module';
import { FinancialsModule } from './financials/financials.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { IotModule } from './iot/iot.module';
import { ControlModule } from './control/control.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USER'),
                password: configService.get<string>('DB_PASS'),
                database: configService.get<string>('DB_NAME'),
                autoLoadEntities: true,
                synchronize: true,
            }),
        }),
        AuthModule,
        SeedModule,
        CustomerModule,
        RegionAdminModule,
        PlantModule,
        PlantAdminModule,
        EmployeesModule,
        TeamsModule,
        AuditModule,
        WorkflowModule,
        SurveysModule,
        QuotationsModule,
        PaymentsModule,
        TicketsModule,
        CostEstimationModule,
        NotificationsModule,
        InventoryModule,
        PricingModule,
        FinancialsModule,
        PortfolioModule,
        PortfolioModule,
        MonitoringModule,
        SubscriptionModule,
        IotModule,
        ControlModule,
        EventEmitterModule.forRoot(),
    ],
})
export class AppModule { }
