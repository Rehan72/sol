import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Role } from '../common/enums/role.enum';
import { RegisterDto } from './dto/register.dto';

import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType, NotificationChannel } from '../entities/notification.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwt: JwtService,
    private configService: ConfigService,
    private notifications: NotificationsService,
  ) { }

  async login(email: string, password: string) {
    console.log(`Attempting login for email: ${email}`);
    const user = await this.usersRepo.findOne({ where: { email } });
    if (user) {
      console.log(`Found user: ${user.email} (ID: ${user.id})`);
    } else {
      console.log(`User not found for email: ${email}`);
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.getTokens(user.id, user.email, user.role, user.name);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    await this.usersRepo.update(userId, { hashedRefreshToken: null });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user || !user.hashedRefreshToken) throw new ForbiddenException('Access Denied');

    const tokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!tokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email, user.role, user.name);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.usersRepo.update(userId, { hashedRefreshToken: hash });
  }

  async getTokens(userId: string, email: string, role: string, name: string) {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        { sub: userId, email, role, name },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_EXPIRES') as any,
        },
      ),
      this.jwt.signAsync(
        { sub: userId, email, role, name },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES') as any,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }



  async registerCustomer(dto: RegisterDto) {
    const existingUser = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newCustomer = this.usersRepo.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.fullName,
      phone: dto.phone,
      role: dto.role || Role.CUSTOMER, // Use provided role or default
      termAccepted: dto.termOfService,
    });
    await this.usersRepo.save(newCustomer);

    // Send Welcome Notification
    try {
        await this.notifications.send(
            newCustomer.id,
            'Welcome to SOLARMAX! ☀️',
            `Hi ${newCustomer.name}, welcome to your solar journey. Please complete your profile setup.`,
            NotificationType.SUCCESS
        );

        // Notify Super Admins
        const admins = await this.usersRepo.find({ where: { role: Role.SUPER_ADMIN } });
        for (const admin of admins) {
            await this.notifications.send(
                admin.id,
                'New Customer Registered 👤',
                `A new customer ${newCustomer.name} (${newCustomer.email}) has registered.`,
                NotificationType.INFO,
                [NotificationChannel.SYSTEM]
            );
        }

    } catch (e) {
        console.error('Failed to send welcome/admin notification', e);
    }

    return {
      name: newCustomer.name,
      message: `Hi ${newCustomer.name}, your onboarding is successful. Please login and add details.`,
    };
  }
}
