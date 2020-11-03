import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

// index, show, create, update e delete
export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    // Carregar o service, verificar se ele precisa de alguma dependência e injeta
    // Ele retorna uma instancia da classe
    const sendForgotPasswordEmail = container.resolve(
      SendForgotPasswordEmailService,
    );

    await sendForgotPasswordEmail.execute({
      email,
    });

    return response.status(204).json();
  }
}
