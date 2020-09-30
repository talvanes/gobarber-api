import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import User from '../infra/typeorm/entities/user';
import IUserRepository from '../repositories/IUserRepository';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    // emails are UNIQUE
    const anotherUserExists = await this.usersRepository.findByEmail(email);
    if (anotherUserExists) {
      throw new AppError('Email address already used.');
    }

    //  "hide" password through cryptography
    const hashedPassword = await this.hashProvider.generateHash(password);
    // create a new user
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    // invalidate user record caches
    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}

export default CreateUserService;
