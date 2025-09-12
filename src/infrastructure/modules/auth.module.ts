import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
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
    DrizzleUserRepository,
    DrizzleAuthRepository,
    NestLoggerService,
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
  ],
  exports: [AuthService, UserService],
})
export class AuthModule { }
