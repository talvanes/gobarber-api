import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

import User from '../infra/typeorm/entities/user';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  user_id: string;
  avatar_filename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUserRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, avatar_filename }: IRequest): Promise<User> {
    // Check authenticated user
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('Only authenticated users can change avatars.', 401);
    }

    // Delete previous avatar if available
    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    // Update user's avatar with new image
    const filename = await this.storageProvider.saveFile(avatar_filename);
    user.avatar = filename;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
