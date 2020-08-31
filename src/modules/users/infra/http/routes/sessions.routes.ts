import { Router } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserSessionService from '@modules/users/services/AuthenticateUserSessionService';

const sessionRouter = Router();

sessionRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  // Authenticate User Session
  const authenticateUser = container.resolve(AuthenticateUserSessionService);

  const { user, token } = await authenticateUser.execute({ email, password });

  delete user.password;

  return response.json({ user, token });
});

export default sessionRouter;
