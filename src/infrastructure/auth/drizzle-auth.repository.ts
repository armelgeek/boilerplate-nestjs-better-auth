import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../../domain/interfaces/repositories.interface';
import { User } from '../../domain/entities/user.entity';
import { db } from '../database/connection';
import { sessions } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class DrizzleAuthRepository implements AuthRepository {
  async createUser(
    email: string,
    password: string,
    name: string,
  ): Promise<User | null> {
    try {
      return null;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    try {
      return null;
    } catch (error) {
      throw new Error(`Failed to verify password: ${error.message}`);
    }
  }

  async createSession(userId: string): Promise<string> {
    try {
      return '';
    } catch (error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }
  }

  async validateSession(sessionId: string): Promise<User | null> {
    try {
      return null;
    } catch (error) {
      throw new Error(`Failed to validate session: ${error.message}`);
    }
  }

  async revokeSession(sessionId: string): Promise<void> {
    try {
      await db.delete(sessions).where(eq(sessions.id, sessionId));
    } catch (error) {
      throw new Error(`Failed to revoke session: ${error.message}`);
    }
  }

  async refreshSession(sessionId: string): Promise<string> {
    try {
      const sessionResult = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
      if (sessionResult.length === 0) {
        throw new Error('Session not found');
      }

      const session = sessionResult[0];

      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        await db.delete(sessions).where(eq(sessions.id, sessionId));
        throw new Error('Session expired');
      }

      // Create new session
      const newSessionId = await this.createSession(session.userId);

      // Remove old session
      await db.delete(sessions).where(eq(sessions.id, sessionId));

      return newSessionId;
    } catch (error) {
      throw new Error(`Failed to refresh session: ${error.message}`);
    }
  }
}
