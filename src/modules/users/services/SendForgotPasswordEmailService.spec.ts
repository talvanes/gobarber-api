import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeMailProvider: FakeMailProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover password with the email', async () => {
    // Spy on 'sendMail' method
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    // first, in order to assure password recovering, user must exist
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.net',
      password: '123456',
    });

    // now, recover password
    await sendForgotPasswordEmail.execute({
      email: 'johndoe@example.net',
    });

    // then, expect
    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover password form a non-user', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'johndoe@example.net',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    // Spy on 'generate' method
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    // first, user must exist
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    // now, recover password
    await sendForgotPasswordEmail.execute({
      email: 'johndoe@example.com',
    });

    // I should expect to have a user token generated
    expect(generateToken).toBeCalledWith(user.id);
  });
});
