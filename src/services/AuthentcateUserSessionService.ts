import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';

import User from '../models/user';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
}

class AuthenticateUserSessionService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    // Check whether User is valid
    const sessionRepository = getRepository(User);

    const user = await sessionRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('Incorrect email/password combination.');
    }

    // Check Password
    // user.password -> password "crypted"
    // password -> plain version
    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error('Incorrect email/password combination.');
    }

    // Return User credentials
    return {
      user,
    };
  }
}

export default AuthenticateUserSessionService;
