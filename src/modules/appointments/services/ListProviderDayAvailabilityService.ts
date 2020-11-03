import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import User from '@modules/users/infra/typeorm/entities/User';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

/**
 * Como vamos retornar isso, não podemos colocar que o tipo de retorno da resposta é de um tipo e serão vários elementos
 * Temos que retornar o array pronto já, um retorno só
 * Por isso, criamos esse type com um array onde cada elemento tem um dia e se está disponível ou não
 */
type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvalabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequestDTO): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    const hourStart = 8;

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map(hour => {
      const hasAppointmentsInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        // se não tiver agendamento no horário vai ser false, mas como quero saber quais não tem
        // então devo negar
        available: !hasAppointmentsInHour && isAfter(compareDate, currentDate),
        // Verificando também se a data do agendamento é depois da data atual
      };
    });

    return availability;
  }
}

export default ListProviderDayAvalabilityService;
