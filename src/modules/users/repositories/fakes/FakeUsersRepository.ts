import { uuid } from 'uuidv4';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '@modules/users/infra/typeorm/entities/user';

class FakeUsersRepository implements IUserRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const userFound = this.users.find(user => user.id === id);

    return userFound;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const userFound = this.users.find(user => user.email === email);

    return userFound;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const newUser = new User();

    Object.assign(newUser, { id: uuid() }, userData);

    this.users.push(newUser);

    return newUser;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(
      userFound => userFound.id === user.id,
    );

    this.users[findIndex] = user;

    return this.users[findIndex];
  }
}

export default FakeUsersRepository;