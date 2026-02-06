import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateRegionAdminDto } from './dto/create-region-admin.dto';
import { UpdateRegionAdminDto } from './dto/update-region-admin.dto';
import { Role } from '../common/enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegionAdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createRegionAdminDto: CreateRegionAdminDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createRegionAdminDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      createRegionAdminDto.password,
      10,
    );

    // Create region admin
    const regionAdmin = this.userRepository.create({
      ...createRegionAdminDto,
      password: hashedPassword,
      role: Role.REGION_ADMIN,
      termAccepted: true,
      isOnboarded: true,
    });

    const savedRegionAdmin = await this.userRepository.save(regionAdmin);

    // Remove password from response
    delete savedRegionAdmin.password;
    delete savedRegionAdmin.hashedRefreshToken;

    return savedRegionAdmin;
  }

  async findAll(): Promise<User[]> {
    const regionAdmins = await this.userRepository.find({
      where: { role: Role.REGION_ADMIN },
      select: [
        'id',
        'name',
        'email',
        'phone',
        'state',
        'city',
        'pincode',
        'location',
        'latitude',
        'longitude',
        'regionName',
        'regionCode',
        'country',
        'utility',
        'isOnboarded',
        'role',
      ],
    });

    return regionAdmins;
  }

  async findOne(id: string): Promise<User> {
    const regionAdmin = await this.userRepository.findOne({
      where: { id, role: Role.REGION_ADMIN },
      select: [
        'id',
        'name',
        'email',
        'phone',
        'state',
        'city',
        'pincode',
        'location',
        'latitude',
        'longitude',
        'regionName',
        'regionCode',
        'country',
        'utility',
        'isOnboarded',
        'role',
      ],
    });

    if (!regionAdmin) {
      throw new NotFoundException(`Region Admin with ID ${id} not found`);
    }

    return regionAdmin;
  }

  async update(
    id: string,
    updateRegionAdminDto: UpdateRegionAdminDto,
  ): Promise<User> {
    const regionAdmin = await this.findOne(id);

    // If password is being updated, hash it
    if (updateRegionAdminDto.password) {
      updateRegionAdminDto.password = await bcrypt.hash(
        updateRegionAdminDto.password,
        10,
      );
    }

    // Update region admin
    Object.assign(regionAdmin, updateRegionAdminDto);
    const updatedRegionAdmin = await this.userRepository.save(regionAdmin);

    // Remove sensitive fields
    delete updatedRegionAdmin.password;
    delete updatedRegionAdmin.hashedRefreshToken;

    return updatedRegionAdmin;
  }

  async remove(id: string): Promise<{ message: string }> {
    const regionAdmin = await this.findOne(id);

    await this.userRepository.remove(regionAdmin);

    return {
      message: `Region Admin ${regionAdmin.name} deleted successfully`,
    };
  }

  async getStatistics(): Promise<{
    total: number;
    active: number;
    byState: { state: string; count: number }[];
  }> {
    const total = await this.userRepository.count({
      where: { role: Role.REGION_ADMIN },
    });

    const active = await this.userRepository.count({
      where: { role: Role.REGION_ADMIN, isOnboarded: true },
    });

    // Get count by state
    const byStateRaw = await this.userRepository
      .createQueryBuilder('user')
      .select('user.state', 'state')
      .addSelect('COUNT(*)', 'count')
      .where('user.role = :role', { role: Role.REGION_ADMIN })
      .andWhere('user.state IS NOT NULL')
      .groupBy('user.state')
      .getRawMany();

    const byState = byStateRaw.map((item) => ({
      state: item.state,
      count: parseInt(item.count, 10),
    }));

    return {
      total,
      active,
      byState,
    };
  }
}
