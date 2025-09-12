import { Injectable } from '@nestjs/common';
import { UserUseCases, GetUserQuery } from '../repositories/inbound.ports';
import { UserRepositoryPort, LoggerPort } from '../repositories/outbound.ports';
import { User } from '../../domain/entities/user.entity';
import { UserDomainService } from '../../domain/services/user-domain.service';

@Injectable()
export class UserService implements UserUseCases {
  private readonly userDomainService: UserDomainService;

  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly logger: LoggerPort,
  ) {
    this.userDomainService = new UserDomainService(userRepository);
  }

  async getUser(query: GetUserQuery): Promise<User | null> {
    this.logger.log(`Getting user: ${query.userId}`, 'UserService');

    try {
      return await this.userRepository.findById(query.userId);
    } catch (error) {
      this.logger.error(
        `Failed to get user: ${query.userId}`,
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
      const user = await this.userDomainService.validateUserExists(userId);

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
