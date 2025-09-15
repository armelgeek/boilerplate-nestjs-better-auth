import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Req,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { AuthService } from '../auth/auth.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  @Put('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async updateProfile(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ) {
    const sessionToken = 
      request.cookies?.['session_token'] ||
      request.headers.authorization?.replace('Bearer ', '');

    if (!sessionToken) {
      throw new UnauthorizedException('No session token provided');
    }

    const currentUser = await this.authService.validateSession(sessionToken);
    if (!currentUser) {
      throw new UnauthorizedException('Invalid session');
    }

    const updatedUser = await this.userService.updateUserProfile(
      currentUser.id,
      updateUserDto,
    );

    return {
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        emailVerified: updatedUser.emailVerified,
        image: updatedUser.image,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    };
  }

  @Delete('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  async deleteAccount(@Req() request: Request) {
    const sessionToken = 
      request.cookies?.['session_token'] ||
      request.headers.authorization?.replace('Bearer ', '');

    if (!sessionToken) {
      throw new UnauthorizedException('No session token provided');
    }

    const currentUser = await this.authService.validateSession(sessionToken);
    if (!currentUser) {
      throw new UnauthorizedException('Invalid session');
    }

    // Logout user first (revoke session)
    await this.authService.logout(sessionToken);
    
    // Delete user account
    await this.userService.deleteUser(currentUser.id);

    return {
      message: 'Account deleted successfully',
    };
  }
}