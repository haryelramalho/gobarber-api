/**
 * Criando outro controller diferente do controller de appointments, por que esse controler vai tratar apenas
 * dos appointments quando relacionados a um provider, ou seja, se formos excluir um agendamento de um provider
 * utilizaremos esse controller, para listar também
 *
 * Se estivessemos utilizando aquiele controller, não poderiamos fazer uma listagem específica pra um provider,
 * lá é um controller que influencia todos os appointments, ou seja, se listarmos, esperamos como retorno
 * todos os appointments sem filtro algum
 */

import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { day, month, year } = request.query;

    // container.resolve chamando a injeção
    const listProviderAppointments = container.resolve(
      ListProviderAppointmentsService,
    );

    const appointments = await listProviderAppointments.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(classToClass(appointments));
  }
}
