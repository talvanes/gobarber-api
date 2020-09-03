import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserSessionService from '@modules/users/services/AuthenticateUserSessionService';
import CreateUserService from '@modules/users/services/CreateUserService';

describe('AuthenticateUserSession', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    const authenticateUserSession = new AuthenticateUserSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.net',
      password: '123456',
    });

    const response = await authenticateUserSession.execute({
      email: 'johndoe@example.net',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });
});
