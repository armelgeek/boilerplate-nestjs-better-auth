import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../../application/use-cases/auth.service';
import { UserService } from '../../application/use-cases/user.service';
import { BetterAuthAdapter } from '../auth/better-auth.adapter';
import { InMemoryUserRepository } from '../repositories/in-memory-user.repository';
import { NestLoggerService } from '../services/logger.service';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
import { AuthGuard } from '../guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [AuthController, UserController],
  providers: [
    Reflector,
    // Infrastructure adapters - direct providers
    BetterAuthAdapter,
    InMemoryUserRepository,
    NestLoggerService,
    // Application use cases - direct providers
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
