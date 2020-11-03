import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '../dtos/IFindAllProvidersDTO';

export default interface IUsersRepository {
  findAllProviders(data: IFindAllProvidersDTO): Promise<User[]>;
  findByEmail(_: string): Promise<User | undefined>;
  // Nesse caso, como irei receber um objeto dentro de uma função, é importante criar um DTO
  create(_: ICreateUserDTO): Promise<User>;
  findById(_: string): Promise<User | undefined>;
  save(_: User): Promise<User>;
}
