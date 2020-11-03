import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '../entities/Appointment';

/**
 * Repository implements IUsersRepository => definindo qual a interface da classe, quais métodos ela tem
 */
class AppointmentsRepository implements IAppointmentRepository {
  // Recuperando os métodos do repositório do typeorm para os appointments
  private ormRepository: Repository<Appointment>;

  constructor() {
    // inicializando o repositório
    this.ormRepository = getRepository(Appointment);
  }

  /**
   * Quando transformamos uma função em Async, ela retornará por padrão um promisse
   * Podemos definir o tipo da promisse também
   * E dentro desse método personalizado, eu posso utilizar os métodos padrões do repositório por que eu extendi na classe
   */
  public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id }, // date: date, onde a data é igual a uma certa data que foi passada por parâmetro
    });

    // Encontra se não encontrar, retorna um null
    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    // Se a string não tiver com 2 digitos, ela vai adicionar 1 zero a esquerda
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        /**
         * Raw => Será passada uma query sem filtro pelo typeORM diretamente pro POSTGRES
         * O typeORM quando cria a tabela e os campos, ele modifica o nome para caso tenha duplicidade,
         * nesse caso preciso pegar o nome do campo que o typeORM atribuiu com dateFieldName
         *
         * to_char() => converte os valores dos campos em string em um determinado formato
         */
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      relations: ['user'],
    });

    return appointments;
  }

  public async create({
    date,
    user_id,
    provider_id,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
