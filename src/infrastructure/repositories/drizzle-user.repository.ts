import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/interfaces/repositories.interface';
import { User } from '../../domain/entities/user.entity';
import { db } from '../database/connection';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class DrizzleUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    try {
      const userResult = await db.select().from(users).where(eq(users.id, id)).limit(1);
      if (userResult.length === 0) {
        return null;
      }

      const userData = userResult[0];
      return User.fromPersistence({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        createdAt: new Date(userData.createdAt),
        updatedAt: new Date(userData.updatedAt),
        emailVerified: userData.emailVerified,
        image: userData.image,
      });
    } catch (error) {
      throw new Error(`Failed to find user by id: ${error.message}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (userResult.length === 0) {
        return null;
      }

      const userData = userResult[0];
      return User.fromPersistence({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        createdAt: new Date(userData.createdAt),
        updatedAt: new Date(userData.updatedAt),
        emailVerified: userData.emailVerified,
        image: userData.image,
      });
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  async save(user: User): Promise<User> {
    try {
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        image: user.image,
        updatedAt: new Date().toISOString(),
      };

      // Check if user exists
      const existingResult = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
      
      if (existingResult.length > 0) {
        // Update existing user
        await db.update(users)
          .set(userData)
          .where(eq(users.id, user.id));
      } else {
        // This shouldn't happen in normal flow since users are created via auth
        throw new Error('User not found for update');
      }

      return user;
    } catch (error) {
      throw new Error(`Failed to save user: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.delete(users).where(eq(users.id, id));
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }
}
