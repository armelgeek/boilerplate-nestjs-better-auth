import { Injectable } from '@nestjs/common';
import {
  AuthUseCases,
  LoginCommand,
  RegisterCommand,
  RefreshTokenCommand,
  LogoutCommand,
  AuthResponse,
  RefreshResponse,
} from '../ports/inbound.ports';
import {
  AuthRepository,
  UserRepositoryPort,
  LoggerPort,
} from '../ports/outbound.ports';
import { User } from '../../domain/entities/user.entity';
import { EmailVO } from '../../domain/value-objects/email.vo';
import { UserIdVO } from '../../domain/value-objects/user-id.vo';
import { UserDomainService } from '../../domain/services/user-domain.service';

@Injectable()
export class AuthService implements AuthUseCases {
  private readonly userDomainService: UserDomainService;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepositoryPort,
    private readonly logger: LoggerPort,
  ) {
    this.userDomainService = new UserDomainService(userRepository);
  }

  async login(command: LoginCommand): Promise<AuthResponse> {
    this.logger.log(`Login attempt for email: ${command.email}`, 'AuthService');

    try {
      const user = await this.authRepository.verifyPassword(
        command.email,
        command.password,
      );

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const sessionId = await this.authRepository.createSession(user.id.value);

      this.logger.log(
        `Login successful for user: ${user.id.value}`,
        'AuthService',
      );

      return {
        user,
        sessionId,
      };
    } catch (error) {
      this.logger.error(
        `Login failed for email: ${command.email}`,
        error.message,
        'AuthService',
      );
      throw error;
    }
  }

  async register(command: RegisterCommand): Promise<AuthResponse> {
    this.logger.log(
      `Registration attempt for email: ${command.email}`,
      'AuthService',
    );

    try {
      const email = new EmailVO(command.email);

      const isEmailAvailable =
        await this.userDomainService.isEmailAvailable(email);
      if (!isEmailAvailable) {
        throw new Error('Email already exists');
      }

      const user = await this.authRepository.createUser(
        command.email,
        command.password,
        command.name,
      );

      const sessionId = await this.authRepository.createSession(user.id.value);

      this.logger.log(
        `Registration successful for user: ${user.id.value}`,
        'AuthService',
      );

      return {
        user,
        sessionId,
      };
    } catch (error) {
      this.logger.error(
        `Registration failed for email: ${command.email}`,
        error.message,
        'AuthService',
      );
      throw error;
    }
  }

  async logout(command: LogoutCommand): Promise<void> {
    this.logger.log(
      `Logout attempt for session: ${command.sessionId}`,
      'AuthService',
    );

    try {
      await this.authRepository.revokeSession(command.sessionId);
      this.logger.log(
        `Logout successful for session: ${command.sessionId}`,
        'AuthService',
      );
    } catch (error) {
      this.logger.error(
        `Logout failed for session: ${command.sessionId}`,
        error.message,
        'AuthService',
      );
      throw error;
    }
  }

  async refreshToken(command: RefreshTokenCommand): Promise<RefreshResponse> {
    this.logger.log(
      `Token refresh attempt for session: ${command.sessionId}`,
      'AuthService',
    );

    try {
      const newSessionId = await this.authRepository.refreshSession(
        command.sessionId,
      );

      this.logger.log(
        `Token refresh successful for session: ${command.sessionId}`,
        'AuthService',
      );

      return {
        sessionId: newSessionId,
      };
    } catch (error) {
      this.logger.error(
        `Token refresh failed for session: ${command.sessionId}`,
        error.message,
        'AuthService',
      );
      throw error;
    }
  }

  async validateSession(sessionId: string): Promise<User | null> {
    try {
      return await this.authRepository.validateSession(sessionId);
    } catch (error) {
      this.logger.error(
        `Session validation failed for session: ${sessionId}`,
        error.message,
        'AuthService',
      );
      return null;
    }
  }
}
