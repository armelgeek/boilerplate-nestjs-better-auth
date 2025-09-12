import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../../application/repositories/outbound.ports';
import { User } from '../../domain/entities/user.entity';
import { IdGenerator, PasswordUtils } from '../../shared/utils/common.utils';

// In-memory storage for demo purposes
// In production, use a proper database
const users = new Map<string, any>();
const sessions = new Map<string, any>();

// Export getter for shared access
export function getUserStorage() {
  return users;
}

export function getSessionStorage() {
  return sessions;
}

@Injectable()
export class BetterAuthAdapter implements AuthRepository {
  async createUser(
    email: string,
    password: string,
    name: string,
  ): Promise<User> {
    try {
      // Hash password (simplified for demo)
      const hashedPassword = await PasswordUtils.hash(password);

      const userId = IdGenerator.generate();

      const user = User.create({
        id: userId,
        email,
        name,
        emailVerified: false,
      });

      // Store in memory (in production, use proper database)
      users.set(userId, {
        ...user.toPrimitives(),
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    try {
      // Find user by email
      const userEntry = Array.from(users.values()).find(
        (u) => u.email === email,
      );
      if (!userEntry) {
        return null;
      }

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
        createdAt: userEntry.createdAt,
        updatedAt: userEntry.updatedAt,
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

      const session = {
        id: sessionId,
        userId,
        expiresAt,
        createdAt: new Date(),
      };

      sessions.set(sessionId, session);
      return sessionId;
    } catch (error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }
  }

  async validateSession(sessionId: string): Promise<User | null> {
    try {
      const session = sessions.get(sessionId);
      if (!session) {
        return null;
      }

      // Check if session is expired
      if (session.expiresAt < new Date()) {
        sessions.delete(sessionId);
        return null;
      }

      // Get user
      const userEntry = users.get(session.userId);
      if (!userEntry) {
        sessions.delete(sessionId);
        return null;
      }

      // Convert to domain entity
      return User.fromPersistence({
        id: userEntry.id,
        email: userEntry.email,
        name: userEntry.name,
        createdAt: userEntry.createdAt,
        updatedAt: userEntry.updatedAt,
        emailVerified: userEntry.emailVerified,
        image: userEntry.image,
      });
    } catch (error) {
      throw new Error(`Failed to validate session: ${error.message}`);
    }
  }

  async revokeSession(sessionId: string): Promise<void> {
    try {
      sessions.delete(sessionId);
    } catch (error) {
      throw new Error(`Failed to revoke session: ${error.message}`);
    }
  }

  async refreshSession(sessionId: string): Promise<string> {
    try {
      const session = sessions.get(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      // Check if session is expired
      if (session.expiresAt < new Date()) {
        sessions.delete(sessionId);
        throw new Error('Session expired');
      }

      // Create new session
      const newSessionId = await this.createSession(session.userId);

      // Remove old session
      sessions.delete(sessionId);

      return newSessionId;
    } catch (error) {
      throw new Error(`Failed to refresh session: ${error.message}`);
    }
  }
}
