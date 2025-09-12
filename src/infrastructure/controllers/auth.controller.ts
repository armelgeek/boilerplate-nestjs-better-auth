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
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response, Request } from 'express';
import { BetterAuthService } from '../auth/better-auth.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto/auth.dto';
import { Public } from '../guards/auth.guard';
import { AuthenticatedRequest } from '../../shared/types/auth.types';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly betterAuthService: BetterAuthService) {}

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
    try {
      const result = await this.betterAuthService.signIn(
        loginDto.email,
        loginDto.password,
      );

      if (!result || !result.user || !result.session) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const { session, user } = result;

      // Set session cookie
      response.cookie('better-auth.session_token', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          image: user.image || null,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        sessionToken: session.id,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
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
    try {
      const result = await this.betterAuthService.signUp(
        registerDto.email,
        registerDto.password,
        registerDto.name,
      );

      if (!result || !result.user) {
        throw new BadRequestException('Registration failed');
      }

      const { session, user } = result;

      // Set session cookie
      response.cookie('better-auth.session_token', session?.id || '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return {
        message: 'Registration successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
          image: user.image || null,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        sessionToken: session?.id || '',
      };
    } catch (error) {
      if (error.message?.includes('email')) {
        throw new BadRequestException('Email already exists');
      }
      throw new BadRequestException('Registration failed');
    }
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
    const sessionToken = 
      request.session?.id || 
      request.cookies?.['better-auth.session_token'] ||
      request.headers.authorization?.replace('Bearer ', '');

    if (sessionToken) {
      await this.betterAuthService.signOut(sessionToken);
    }

    // Clear session cookie
    response.clearCookie('better-auth.session_token');

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
    try {
      // Better Auth handles session refresh automatically
      // We just validate the current session
      const sessionData = await this.betterAuthService.validateSession(
        refreshDto.sessionId,
      );

      if (!sessionData) {
        throw new UnauthorizedException('Invalid session');
      }

      return {
        message: 'Session is valid',
        sessionToken: refreshDto.sessionId,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid session');
    }
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
