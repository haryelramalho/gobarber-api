import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  user_id: string;
  date: Date;
}
/*
  O service não tem acesso direto aos dados da requisição e os dados da resposta

  Regra de negócio: Basicamente aquilo que é específico da nossa aplicação
    Temos que ter apenas um método no serviço

  !!(SOLID)
    1. Single Responsability Principle
    5. Dependency Inversion Principle (A camada de domínio não deve se comunicar com a camada de infra diretamente)

    Obs: Ou seja, a camada de domínio não deveria saber que tecnologia estamos usando para salvar no banco, por exemplo
*/
@injectable() // Toda classe que pode ser "injetada" precisa desse decorator
class CreateAppointmentService {
  // Para o Service funcionar, o repositório tem que ser passado por parâmetro e ele tem que ser do tipo da Interface de Repository
  constructor(
    @inject('AppointmentsRepository') // Falando qual a injeção eu vou utilizar
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  /*
    Unico service, o service possui apenas UMA responsabilidade
  */
  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequestDTO): Promise<Appointment> {
    // startOfHour -> Pega a hora xx:00, volta para o inicio da hora atual;
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now()))
      throw new AppError("You can't create an appointment on a past date");

    if (user_id === provider_id)
      throw new AppError("You can't create an appointment with yourself");

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17)
      throw new AppError('You can only create appointment between 8am and 5pm');

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This Appointment is already booked.');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
      user_id,
    });

    // Olhar os tipos de formatação no dateFNS
    // Aspas simples pra escapar os textos entre as formatações
    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para ${dateFormatted}`,
    });

    await this.cacheProvider.invalidate(
      // Nesse caso, no format não preciso incluir o zero pq o cache vai salvar sem ele
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
