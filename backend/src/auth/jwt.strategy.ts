import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    console.log('JwtStrategy Secret Loaded:', secret ? 'EXISTS (length: ' + secret.length + ')' : 'MISSING');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      // relations: ['plant'], // 'plant' is a jsonb column
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    // console.log('--- JWT VALIDATION SUCCESSFUL ---');
    // console.log('User Payload:', payload);
    return user;
  }
}
