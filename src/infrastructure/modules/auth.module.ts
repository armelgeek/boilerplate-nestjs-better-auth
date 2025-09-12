import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
import { AuthGuard } from '../guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from '../../application/services/auth.service';
import { UserService } from '../../application/services/user.service';
import { DrizzleUserRepository } from '../repositories/drizzle-user.repository';
import { DrizzleAuthRepository } from '../auth/drizzle-auth.repository';
import { NestLoggerService } from '../services/logger.service';

@Module({
  controllers: [AuthController, UserController],
  providers: [
    Reflector,
    // Infrastructure adapters 
    DrizzleUserRepository,
    DrizzleAuthRepository,
    NestLoggerService,
    // Application services
    {
      provide: AuthService,
      useFactory: (authRepo, userRepo, logger) => 
        new AuthService(authRepo, userRepo, logger),
      inject: [DrizzleAuthRepository, DrizzleUserRepository, NestLoggerService],
    },
    {
      provide: UserService,
      useFactory: (userRepo, logger) => new UserService(userRepo, logger),
      inject: [DrizzleUserRepository, NestLoggerService],
    },
    // Guards
    {
      provide: APP_GUARD,
      useFactory: (reflector, authService) =>
        new AuthGuard(reflector, authService),
      inject: [Reflector, AuthService],
    },
  ],
  exports: [AuthService, UserService],
})
export class AuthModule {}
