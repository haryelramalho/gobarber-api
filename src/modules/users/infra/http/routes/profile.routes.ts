import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProfileController from '../controllers/ProfileController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

/*
  Rota: Receber uma requisição, chamar outro arquivo e devolver uma resposta processada pelo outro arquivo
    (ROTA) Tudo o que é transformação de dados, recebe de um jeito e manda de outro deixamos na rota
      (SERVICE) Sempre que tiver algo além disso, iremos abstrair a lógica (regra de negócio) dentro de um service
    (ROTA) Retorna a resposta do service
*/
const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profileController.update,
);

export default profileRouter;
