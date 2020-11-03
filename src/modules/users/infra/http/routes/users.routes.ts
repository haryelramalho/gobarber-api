import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import multer from 'multer';
import uploadConfig from '@config/upload';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

/*
  Rota: Receber uma requisição, chamar outro arquivo e devolver uma resposta processada pelo outro arquivo
    (ROTA) Tudo o que é transformação de dados, recebe de um jeito e manda de outro deixamos na rota
      (SERVICE) Sempre que tiver algo além disso, iremos abstrair a lógica (regra de negócio) dentro de um service
    (ROTA) Retorna a resposta do service
*/
const usersRouter = Router();
const upload = multer(uploadConfig);
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();
/*
  Como generalizamos no arquivo de rota, não precisamos passar /appointments e sim /
  Lá no outro arquivo já está definido para onde essa requisição vai que no caso é /appointments
*/
usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

// atualizar uma única informação
usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRouter;
