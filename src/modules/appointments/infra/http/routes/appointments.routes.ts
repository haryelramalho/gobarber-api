import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

/*
  Rota/: Receber uma requisição, chamar outro arquivo (controller) e devolver uma resposta processada pelo outro arquivo
    (CONTROLLER) Tudo o que é transformação de dados, recebe de um jeito e manda de outro deixamos no controller
      (SERVICE) Sempre que tiver algo além disso, iremos abstrair a lógica (regra de negócio) dentro de um service
    (CONTROLLER) Retorna a resposta do service
*/
const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (request, response) => {
//   const appointments = await appointmentsRepository.find();

//   return response.json(appointments);
// });

/*
  Como generalizamos no arquivo de rota, não precisamos passar /appointments e sim /
  Lá no outro arquivo já está definido para onde essa requisição vai que no caso é /appointments
*/
appointmentsRouter.post(
  '/',
  celebrate({
    // Utilizando colchetes por que a chave do objeto é uma variável
    // ou poderia utilizar 'body'
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  appointmentsController.create,
);
appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
