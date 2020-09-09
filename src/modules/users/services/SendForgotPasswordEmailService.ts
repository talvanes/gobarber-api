import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
// import User from '../infra/typeorm/entities/user';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserRepository from '../repositories/IUserRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUserRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    // Check whether user exists
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('User does not exist.');
    }

    // Generate user token
    const { token } = await this.userTokensRepository.generate(user.id);

    // Send password recovery confirmation as email mesage
    await this.mailProvider.sendMail(
      email,
      `
      Pedido de recuperação de senha recebido.

      Token: ${token}
      `,
    );
  }
}

export default SendForgotPasswordEmailService;
