import { Injectable } from '@nestjs/common';
import { AuthRepository, UserRepository, Logger } from '../../domain/interfaces/repositories.interface';
import { User } from '../../domain/entities/user.entity';

export interface LoginCommand {
  email: string;
  password: string;
}

export interface RegisterCommand {
  email: string;
  password: string;
  name: string;
}

export interface AuthResult {
  user: User;
  sessionId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly logger: Logger,
  ) {}

  async login(command: LoginCommand): Promise<AuthResult> {
    this.logger.log(`Login attempt for email: ${command.email}`, 'AuthService');

    try {
      const user = await this.authRepository.verifyPassword(
        command.email,
        command.password,
      );

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const sessionId = await this.authRepository.createSession(user.id);

      this.logger.log(`Login successful for user: ${user.id}`, 'AuthService');

      return { user, sessionId };
    } catch (error) {
      this.logger.error(
        `Login failed for email: ${command.email}`,
        error.message,
        'AuthService',
      );
      throw error;
    }
  }

  async register(command: RegisterCommand): Promise<AuthResult> {
    this.logger.log(`Registration attempt for email: ${command.email}`, 'AuthService');

    try {
      // Check if email is already taken
      const existingUser = await this.userRepository.findByEmail(command.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }

      const user = await this.authRepository.createUser(
        command.email,
        command.password,
        command.name,
      );

      const sessionId = await this.authRepository.createSession(user.id);

      this.logger.log(`Registration successful for user: ${user.id}`, 'AuthService');

      return { user, sessionId };
    } catch (error) {
      this.logger.error(
        `Registration failed for email: ${command.email}`,
        error.message,
        'AuthService',
      );
      throw error;
    }
  }

  async logout(sessionId: string): Promise<void> {
    this.logger.log(`Logout attempt for session: ${sessionId}`, 'AuthService');

    try {
      await this.authRepository.revokeSession(sessionId);
      this.logger.log(`Logout successful for session: ${sessionId}`, 'AuthService');
    } catch (error) {
      this.logger.error(
        `Logout failed for session: ${sessionId}`,
        error.message,
        'AuthService',
      );
      throw error;
    }
  }

  async refreshToken(sessionId: string): Promise<string> {
    this.logger.log(`Token refresh attempt for session: ${sessionId}`, 'AuthService');

    try {
      const newSessionId = await this.authRepository.refreshSession(sessionId);
      this.logger.log(`Token refresh successful for session: ${sessionId}`, 'AuthService');
      return newSessionId;
    } catch (error) {
      this.logger.error(
        `Token refresh failed for session: ${sessionId}`,
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