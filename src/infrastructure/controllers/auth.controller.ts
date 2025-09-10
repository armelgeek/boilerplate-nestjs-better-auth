import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from '../../application/use-cases/auth.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto/auth.dto';
import { Public } from '../guards/auth.guard';
import { AuthenticatedRequest } from '../../shared/types/auth.types';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login({
      email: loginDto.email,
      password: loginDto.password,
    });

    // Set session cookie
    response.cookie('session-id', result.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      message: 'Login successful',
      user: result.user.toPrimitives(),
      sessionId: result.sessionId,
    };
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register({
      email: registerDto.email,
      password: registerDto.password,
      name: registerDto.name,
    });

    // Set session cookie
    response.cookie('session-id', result.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      message: 'Registration successful',
      user: result.user.toPrimitives(),
      sessionId: result.sessionId,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  async logout(
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const sessionId = request.session?.id || request.cookies?.['session-id'];

    if (sessionId) {
      await this.authService.logout({ sessionId });
    }

    // Clear session cookie
    response.clearCookie('session-id');

    return {
      message: 'Logout successful',
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh session token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid session' })
  async refreshToken(
    @Body(ValidationPipe) refreshDto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.refreshToken({
      sessionId: refreshDto.sessionId,
    });

    // Set new session cookie
    response.cookie('session-id', result.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      message: 'Token refreshed successfully',
      sessionId: result.sessionId,
    };
  }

  @Post('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
  })
  async getCurrentUser(@Req() request: AuthenticatedRequest) {
    return {
      user: request.user,
    };
  }
}
