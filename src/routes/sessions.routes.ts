import { Router } from 'express';

import AuthenticateUserSessionService from '../services/AuthentcateUserSessionService';

const sessionRouter = Router();

sessionRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;

    // Authenticate User Session
    const authenticateUser = new AuthenticateUserSessionService();

    const { user, token } = await authenticateUser.execute({ email, password });

    delete user.password;

    return response.json({ user, token });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default sessionRouter;
