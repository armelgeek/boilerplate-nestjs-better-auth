import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { db } from '../database/connection';
import { users, sessions } from '../database/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
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
  async login(loginData: LoginDto): Promise<AuthResult> {
    // Find user by email
    const userResult = await db.select().from(users).where(eq(users.email, loginData.email)).limit(1);
    
    if (userResult.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = userResult[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create session
    const sessionId = await this.createSession(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        emailVerified: Boolean(user.emailVerified),
        image: user.image,
      },
      sessionId,
    };
  }

  async register(registerData: RegisterDto): Promise<AuthResult> {
    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, registerData.email)).limit(1);
    
    if (existingUser.length > 0) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerData.password, 10);

    // Create user
    const newUserResult = await db.insert(users).values({
      email: registerData.email,
      password: hashedPassword,
      name: registerData.name,
    }).returning();

    const newUser = newUserResult[0];

    // Create session
    const sessionId = await this.createSession(newUser.id);

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        emailVerified: Boolean(newUser.emailVerified),
        image: newUser.image,
      },
      sessionId,
    };
  }

  async logout(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  async validateSession(sessionId: string): Promise<User | null> {
    const sessionResult = await db
      .select({
        user: users,
        session: sessions,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.id, sessionId))
      .limit(1);

    if (sessionResult.length === 0) {
      return null;
    }

    const { user, session } = sessionResult[0];

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      await db.delete(sessions).where(eq(sessions.id, sessionId));
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      emailVerified: Boolean(user.emailVerified),
      image: user.image,
    };
  }

  async refreshToken(sessionId: string): Promise<string> {
    const sessionResult = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
    
    if (sessionResult.length === 0) {
      throw new UnauthorizedException('Session not found');
    }

    const session = sessionResult[0];

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      await db.delete(sessions).where(eq(sessions.id, sessionId));
      throw new UnauthorizedException('Session expired');
    }

    // Create new session
    const newSessionId = await this.createSession(session.userId);

    // Remove old session
    await db.delete(sessions).where(eq(sessions.id, sessionId));

    return newSessionId;
  }

  private async createSession(userId: string): Promise<string> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    const sessionResult = await db.insert(sessions).values({
      userId,
      expiresAt,
    }).returning();

    return sessionResult[0].id;
  }
}