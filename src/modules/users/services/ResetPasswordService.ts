import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUserRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    // Find user token
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exist.');
    }

    // Find user
    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exist.');
    }

    // Has the token expired?
    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired.');
    }

    // Update password
    user.password = await this.hashProvider.generateHash(password);

    this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
