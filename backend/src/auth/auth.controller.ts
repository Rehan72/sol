import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import { RegisterDto } from './dto/register.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { loginSchema, registerSchema } from '../common/schemas/validation.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful', schema: { example: { access_token: 'jwt_token', refresh_token: 'rt_token' } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UsePipes(new ZodValidationPipe(loginSchema))
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req: Request) {
    const user = (req as any).user;
    // user object depends on JwtStrategy validate. With standard strategy it returns payload.
    // Assuming payload has 'sub' as userId.
    return this.authService.logout(user['sub'] || user['userId']); 
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(@Req() req: Request) {
    const userId = (req as any).user['sub'];
    const refreshToken = (req as any).user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }



  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register Customer' })
  @ApiResponse({ status: 200, description: 'Customer registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async registerCustomer(@Body() registerDto: RegisterDto) {
    return this.authService.registerCustomer(registerDto);
  }
}
