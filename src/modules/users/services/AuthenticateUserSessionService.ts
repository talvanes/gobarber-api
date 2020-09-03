import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/user';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserSessionService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    // Check whether User is valid
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Incorrect email/password combination.');
    }

    // Check Password
    // user.password -> password "crypted"
    // password -> plain version
    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.');
    }

    // JWT Token
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    // Return User credentials
    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserSessionService;
