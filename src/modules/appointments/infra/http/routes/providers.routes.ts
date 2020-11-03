import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';

/*
  Rota/: Receber uma requisição, chamar outro arquivo (controller) e devolver uma resposta processada pelo outro arquivo
    (CONTROLLER) Tudo o que é transformação de dados, recebe de um jeito e manda de outro deixamos no controller
      (SERVICE) Sempre que tiver algo além disso, iremos abstrair a lógica (regra de negócio) dentro de um service
    (CONTROLLER) Retorna a resposta do service
*/
const providersRouter = Router();
const providersController = new ProvidersController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();

providersRouter.use(ensureAuthenticated);

/*
  Como generalizamos no arquivo de rota, não precisamos passar /appointments e sim /
  Lá no outro arquivo já está definido para onde essa requisição vai que no caso é /appointments
*/
providersRouter.get('/', providersController.index);
providersRouter.get(
  '/:provider_id/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerMonthAvailabilityController.index,
);
providersRouter.get(
  '/:provider_id/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerDayAvailabilityController.index,
);

export default providersRouter;
