import ICreateUserDTO from '../dtos/ICreateUserDTO';
import User from '../infra/typeorm/entities/user';

export default interface IUserRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
