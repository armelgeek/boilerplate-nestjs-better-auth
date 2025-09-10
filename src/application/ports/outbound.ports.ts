import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { UserId } from '../../domain/value-objects/user-id.vo';

// Authentication repository port
export interface AuthRepository {
  createUser(email: string, password: string, name: string): Promise<User>;
  verifyPassword(email: string, password: string): Promise<User | null>;
  createSession(userId: string): Promise<string>;
  validateSession(sessionId: string): Promise<User | null>;
  revokeSession(sessionId: string): Promise<void>;
  refreshSession(sessionId: string): Promise<string>;
}

// User repository port (re-export for application layer)
export interface UserRepositoryPort {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: UserId): Promise<void>;
}

// Email service port
export interface EmailServicePort {
  sendVerificationEmail(email: string, token: string): Promise<void>;
  sendPasswordResetEmail(email: string, token: string): Promise<void>;
}

// Logger port
export interface LoggerPort {
  log(message: string, context?: string): void;
  error(message: string, trace?: string, context?: string): void;
  warn(message: string, context?: string): void;
  debug(message: string, context?: string): void;
}
