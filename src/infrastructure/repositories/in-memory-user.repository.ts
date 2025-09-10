import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../application/ports/outbound.ports';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { UserIdVO } from '../../domain/value-objects/user-id.vo';
import { EmailVO } from '../../domain/value-objects/email.vo';

// Shared storage with BetterAuthAdapter
import { getUserStorage } from '../auth/better-auth.adapter';

@Injectable()
export class InMemoryUserRepository implements UserRepositoryPort {
  async findById(id: UserId): Promise<User | null> {
    const userStorage = getUserStorage();
    const userData = userStorage.get(id.value);
    if (!userData) {
      return null;
    }

    const userIdVO = new UserIdVO(userData.id);
    const emailVO = new EmailVO(userData.email);

    return User.fromPersistence({
      id: userIdVO,
      email: emailVO,
      name: userData.name,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      emailVerified: userData.emailVerified,
      image: userData.image,
    });
  }

  async findByEmail(email: Email): Promise<User | null> {
    const userStorage = getUserStorage();
    const userEntries = Array.from(userStorage.values());
    const userData = userEntries.find((u) => u.email === email.value);

    if (!userData) {
      return null;
    }

    const userIdVO = new UserIdVO(userData.id);
    const emailVO = new EmailVO(userData.email);

    return User.fromPersistence({
      id: userIdVO,
      email: emailVO,
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
      id: user.id.value,
      email: user.email.value,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      emailVerified: user.emailVerified,
      image: user.image,
      password: userStorage.get(user.id.value)?.password || '', // Keep existing password
    };

    userStorage.set(user.id.value, userData);
    return user;
  }

  async delete(id: UserId): Promise<void> {
    const userStorage = getUserStorage();
    userStorage.delete(id.value);
  }
}
