// import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

describe('SendForgotPasswordEmailService', () => {
  it('should be able to recover password with the email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
    );

    // first, in order to assure password recovering, user must exist
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.net',
      password: '123456',
    });

    // next, recover password
    await sendForgotPasswordEmail.execute({
      email: 'johndoe@example.net',
    });

    // then, expect
    expect(sendMail).toHaveBeenCalled();
  });
});
