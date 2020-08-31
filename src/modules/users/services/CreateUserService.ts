import { hash } from 'bcryptjs';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/user';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  constructor(private usersRepository: IUserRepository) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    // emails are UNIQUE
    const anotherUserExists = await this.usersRepository.findByEmail(email);
    if (anotherUserExists) {
      throw new AppError('Email address already used.');
    }

    //  "hide" password through cryptography
    const hashedPassword = await hash(password, 8);
    // create a new user
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
