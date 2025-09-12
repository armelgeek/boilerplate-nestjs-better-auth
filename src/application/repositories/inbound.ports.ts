import { User } from '../../domain/entities/user.entity';

// DTOs for inbound communications
export interface LoginCommand {
  email: string;
  password: string;
}

export interface RegisterCommand {
  email: string;
  password: string;
  name: string;
}

export interface RefreshTokenCommand {
  sessionId: string;
}

export interface LogoutCommand {
  sessionId: string;
}

export interface GetUserQuery {
  userId: string;
}

// Response DTOs
export interface AuthResponse {
  user: User;
  sessionId: string;
}

export interface RefreshResponse {
  sessionId: string;
}

// Inbound port interfaces (use cases)
export interface AuthUseCases {
  login(command: LoginCommand): Promise<AuthResponse>;
  register(command: RegisterCommand): Promise<AuthResponse>;
  logout(command: LogoutCommand): Promise<void>;
  refreshToken(command: RefreshTokenCommand): Promise<RefreshResponse>;
  validateSession(sessionId: string): Promise<User | null>;
}

export interface UserUseCases {
  getUser(query: GetUserQuery): Promise<User | null>;
  updateUserProfile(
    userId: string,
    name: string,
    image?: string,
  ): Promise<User>;
}
