import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
import { AuthGuard } from '../guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from '../../application/services/auth.service';
import { UserService } from '../../application/services/user.service';
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository';
import { BetterAuthAdapter } from '../auth/better-auth.adapter';
import { NestLoggerService } from '../services/logger.service';

@Module({
  controllers: [AuthController, UserController],
  providers: [
    Reflector,
    // Infrastructure adapters 
    InMemoryUserRepository,
    BetterAuthAdapter,
    NestLoggerService,
    // Application services
    {
      provide: AuthService,
      useFactory: (authRepo, userRepo, logger) => 
        new AuthService(authRepo, userRepo, logger),
      inject: [BetterAuthAdapter, InMemoryUserRepository, NestLoggerService],
    },
    {
      provide: UserService,
      useFactory: (userRepo, logger) => new UserService(userRepo, logger),
      inject: [InMemoryUserRepository, NestLoggerService],
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
