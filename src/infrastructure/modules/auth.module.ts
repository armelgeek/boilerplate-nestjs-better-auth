import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BetterAuthService } from '../auth/better-auth.service';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
import { AuthGuard } from '../guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UserService } from '../../application/use-cases/user.service';
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository';
import { NestLoggerService } from '../services/logger.service';

@Module({
  controllers: [AuthController, UserController],
  providers: [
    Reflector,
    // Better Auth service
    BetterAuthService,
    // Infrastructure adapters 
    InMemoryUserRepository,
    NestLoggerService,
    // Application use cases
    {
      provide: UserService,
      useFactory: (userRepo, logger) => new UserService(userRepo, logger),
      inject: [InMemoryUserRepository, NestLoggerService],
    },
    // Guards
    {
      provide: APP_GUARD,
      useFactory: (reflector, betterAuthService) =>
        new AuthGuard(reflector, betterAuthService),
      inject: [Reflector, BetterAuthService],
    },
  ],
  exports: [BetterAuthService, UserService],
})
export class AuthModule {}
