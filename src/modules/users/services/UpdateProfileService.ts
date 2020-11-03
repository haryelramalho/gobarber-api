import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequestDTO {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfile {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User not found');

    // Id de usuário com o email igual, ou vai ser ele mesmo ou ele está tentando modificar o e-mail para um já existente
    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    /**
     * Se o usuário não quisesse trocar o e-mail e eu não tivesse a segunda condição daria problema
     * Por que iriamos achar o e-mail do próprio usuário que não está atualizando seu e-mail
     */
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id)
      throw new AppError('Email already in use.');

    user.name = name;
    user.email = email;

    if (password && !old_password)
      throw new AppError(
        'You need to inform the old password to set a new password',
      );

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) throw new AppError('Old password does not match.');

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfile;
