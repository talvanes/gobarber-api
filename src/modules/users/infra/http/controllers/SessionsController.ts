import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserSessionService from '@modules/users/services/AuthenticateUserSessionService';

export default class SessionsContoller {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    // Authenticate User Session
    const authenticateUser = container.resolve(AuthenticateUserSessionService);

    const { user, token } = await authenticateUser.execute({ email, password });

    delete user.password;

    return response.json({ user, token });
  }
}
