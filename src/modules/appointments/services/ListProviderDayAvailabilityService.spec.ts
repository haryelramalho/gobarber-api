import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

/**
 * RED
 * GREEN
 * REFACTOR
 */

let listProviderDayAvailability: ListProviderDayAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the day availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 3, 20, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 3, 20, 15, 0, 0),
    });

    /**
     * Criando uma data anterior aos agendamentos que eu criei acima para poder ver se eles estão
     * agendando em datas passadas
     */
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      // usar o getTime() por que o Date.now() retorna um número e precisamos de um Date
      return new Date(2020, 4, 20, 11).getTime();
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id: 'provider',
      day: 20,
      year: 2020,
      month: 4,
    });

    // False para horarios que não tem agendamento disponível

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 13, available: false },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: false },
      ]),
    );
  });
});
