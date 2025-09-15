import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { db } from '../database/connection';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';

export interface UpdateUserDto {
  name?: string;
  image?: string;
}

@Injectable()
export class UserService {
  async getUserById(userId: string): Promise<User | null> {
    const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (userResult.length === 0) {
      return null;
    }

    const user = userResult[0];
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

  async updateUserProfile(userId: string, updateData: UpdateUserDto): Promise<User> {
    const existingUser = await this.getUserById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updatedUserResult = await db
      .update(users)
      .set({
        name: updateData.name || existingUser.name,
        image: updateData.image !== undefined ? updateData.image : existingUser.image,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    const updatedUser = updatedUserResult[0];
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      emailVerified: Boolean(updatedUser.emailVerified),
      image: updatedUser.image,
    };
  }

  async deleteUser(userId: string): Promise<void> {
    const existingUser = await this.getUserById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    await db.delete(users).where(eq(users.id, userId));
  }
}