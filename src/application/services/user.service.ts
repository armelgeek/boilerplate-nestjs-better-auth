import { Injectable } from '@nestjs/common';
import { UserRepository, Logger } from '../../domain/interfaces/repositories.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: Logger,
  ) {}

  async getUserById(userId: string): Promise<User | null> {
    this.logger.log(`Getting user: ${userId}`, 'UserService');

    try {
      return await this.userRepository.findById(userId);
    } catch (error) {
      this.logger.error(
        `Failed to get user: ${userId}`,
        error.message,
        'UserService',
      );
      throw error;
    }
  }

  async updateUserProfile(
    userId: string,
    name: string,
    image?: string,
  ): Promise<User> {
    this.logger.log(`Updating user profile: ${userId}`, 'UserService');

    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const updatedUser = user.updateProfile(name, image);
      return await this.userRepository.save(updatedUser);
    } catch (error) {
      this.logger.error(
        `Failed to update user profile: ${userId}`,
        error.message,
        'UserService',
      );
      throw error;
    }
  }
}