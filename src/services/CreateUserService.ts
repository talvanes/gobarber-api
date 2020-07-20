import { getRepository } from 'typeorm';

import User from '../models/user';

interface IUserRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: IUserRequest): Promise<User> {
    // User Repository
    const userRepository = getRepository(User);

    // emails are UNIQUE
    const anotherUserExists = await userRepository.findOne({
      where: { email },
    });

    if (anotherUserExists) {
      throw new Error('Email address already used.');
    }

    // TODO "hide" password through cryptography

    // create a new user
    const user = userRepository.create({
      name,
      email,
      password,
    });

    await userRepository.save(user);

    return user;
  }
}

export default CreateUserService;
