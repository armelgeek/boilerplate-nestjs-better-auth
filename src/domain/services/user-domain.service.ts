import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.vo';
import { UserId } from '../value-objects/user-id.vo';

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: UserId): Promise<void>;
}

export class UserDomainService {
  constructor(private readonly userRepository: UserRepository) {}

  async isEmailAvailable(email: Email): Promise<boolean> {
    const existingUser = await this.userRepository.findByEmail(email);
    return existingUser === null;
  }

  async validateUserExists(id: UserId): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
