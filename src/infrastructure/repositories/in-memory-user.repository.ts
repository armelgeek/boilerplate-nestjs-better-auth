import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/interfaces/repositories.interface';
import { User } from '../../domain/entities/user.entity';

// Shared storage with BetterAuthAdapter
import { getUserStorage } from '../auth/better-auth.adapter';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const userStorage = getUserStorage();
    const userData = userStorage.get(id);
    if (!userData) {
      return null;
    }

    return User.fromPersistence({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      emailVerified: userData.emailVerified,
      image: userData.image,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const userStorage = getUserStorage();
    const userEntries = Array.from(userStorage.values());
    const userData = userEntries.find((u) => u.email === email);

    if (!userData) {
      return null;
    }

    return User.fromPersistence({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      emailVerified: userData.emailVerified,
      image: userData.image,
    });
  }

  async save(user: User): Promise<User> {
    const userStorage = getUserStorage();
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      emailVerified: user.emailVerified,
      image: user.image,
      password: userStorage.get(user.id)?.password || '', // Keep existing password
    };

    userStorage.set(user.id, userData);
    return user;
  }

  async delete(id: string): Promise<void> {
    const userStorage = getUserStorage();
    userStorage.delete(id);
  }
}
