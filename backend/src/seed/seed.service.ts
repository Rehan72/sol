import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.createSuperAdmin();
  }

  private async createSuperAdmin() {
    const email = process.env.SUPERADMIN_EMAIL;
    const password = process.env.SUPERADMIN_PASSWORD;
   debugger
    const exists = await this.userRepo.findOne({
      where: { email },
    });

    if (exists) {
      console.log('✅ SuperAdmin already exists');
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
    console.log('🚀 Default SuperAdmin created');
  }
}
