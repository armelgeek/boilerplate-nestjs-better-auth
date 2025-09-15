import { Request } from 'express';
import { User } from '../../user/user.entity';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
}

export interface AuthContext {
  user: SessionUser;
  session: AuthSession;
}

export type AuthenticatedRequest = Request & {
  user?: User;
  session?: { id: string };
};
