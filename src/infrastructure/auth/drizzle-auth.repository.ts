import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../../domain/interfaces/repositories.interface';
import { User } from '../../domain/entities/user.entity';
import { IdGenerator, PasswordUtils } from '../../shared/utils/common.utils';
import { db } from '../database/connection';
import { users, sessions } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class DrizzleAuthRepository implements AuthRepository {
  async createUser(
    email: string,
    password: string,
    name: string,
  ): Promise<User> {
    try {
      // Hash password
      const hashedPassword = await PasswordUtils.hash(password);

      const userId = IdGenerator.generate();

      const user = User.create({
        id: userId,
        email,
        name,
        emailVerified: false,
      });

      // Store in database using Drizzle
      await db.insert(users).values({
        id: userId,
        email,
        name,
        password: hashedPassword,
        emailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    try {
      // Find user by email
      const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (userResult.length === 0) {
        return null;
      }

      const userEntry = userResult[0];

      // Verify password
      const isValid = await PasswordUtils.verify(password, userEntry.password);
      if (!isValid) {
        return null;
      }

      // Convert to domain entity
      return User.fromPersistence({
        id: userEntry.id,
        email: userEntry.email,
        name: userEntry.name,
        createdAt: new Date(userEntry.createdAt),
        updatedAt: new Date(userEntry.updatedAt),
        emailVerified: userEntry.emailVerified,
        image: userEntry.image,
      });
    } catch (error) {
      throw new Error(`Failed to verify password: ${error.message}`);
    }
  }

  async createSession(userId: string): Promise<string> {
    try {
      const sessionId = IdGenerator.generate();
      const expiresAt = new Date();
      expiresAt.setTime(expiresAt.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

      await db.insert(sessions).values({
        id: sessionId,
        userId,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
      });

      return sessionId;
    } catch (error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }
  }

  async validateSession(sessionId: string): Promise<User | null> {
    try {
      const sessionResult = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
      if (sessionResult.length === 0) {
        return null;
      }

      const session = sessionResult[0];

      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        await db.delete(sessions).where(eq(sessions.id, sessionId));
        return null;
      }

      // Get user
      const userResult = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
      if (userResult.length === 0) {
        await db.delete(sessions).where(eq(sessions.id, sessionId));
        return null;
      }

      const userEntry = userResult[0];

      // Convert to domain entity
      return User.fromPersistence({
        id: userEntry.id,
        email: userEntry.email,
        name: userEntry.name,
        createdAt: new Date(userEntry.createdAt),
        updatedAt: new Date(userEntry.updatedAt),
        emailVerified: userEntry.emailVerified,
        image: userEntry.image,
      });
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
