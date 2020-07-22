import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import User from '../models/user';
import uploadConfig from '../config/upload';

interface IRequest {
  user_id: string;
  avatar_filename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatar_filename }: IRequest): Promise<User> {
    // Check authenticated user
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new Error('Only authenticated users can change avatars.');
    }

    // Delete previous avatar if available
    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);
      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    // Update user's avatar with new image
    user.avatar = avatar_filename;

    await userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
