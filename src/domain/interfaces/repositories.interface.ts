import { User } from '../entities/user.entity';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

export interface AuthRepository {
  createUser(email: string, password: string, name: string): Promise<User>;
  verifyPassword(email: string, password: string): Promise<User | null>;
  createSession(userId: string): Promise<string>;
  validateSession(sessionId: string): Promise<User | null>;
  revokeSession(sessionId: string): Promise<void>;
  refreshSession(sessionId: string): Promise<string>;
}

export interface Logger {
  log(message: string, context?: string): void;
  error(message: string, trace?: string, context?: string): void;
  warn(message: string, context?: string): void;
  debug(message: string, context?: string): void;
}