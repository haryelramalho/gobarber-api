import { getRepository, Repository } from 'typeorm';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../entities/UserToken';

/**
 * Repository implements IUserTokensRepository => definindo qual a interface da classe, quais métodos ela tem
 */
class UserTokensRepository implements IUserTokensRepository {
  // Recuperando os métodos do repositório do typeorm para os appointments
  // Definindo um tipo para a variável que iremos lidar com as funções do repositório do ORM
  private ormRepository: Repository<UserToken>;

  constructor() {
    // inicializando o repositório
    this.ormRepository = getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });

    return userToken;
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      user_id,
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }
}

export default UserTokensRepository;
