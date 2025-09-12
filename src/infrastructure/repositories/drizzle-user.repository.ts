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
      return null;
    } catch (error) {
      throw new Error(`Failed to find user by id: ${error.message}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return null;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  async save(user: User): Promise<User> {
    try {
       return null;
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
