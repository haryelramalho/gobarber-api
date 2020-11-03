import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());

app.use(express.json());

// Servindo os arquivos de forma estática
app.use('/files', express.static(uploadConfig.uploadsFolder));

app.use(rateLimiter);

app.use(routes);

// Mostrando os erros de validação na resposta da requisição
app.use(errors);

// Middlewers para tratativas de erros no express são obrigados a receber 4 parâmetros
// Express Async Erros (para capturar os erros nas rotas que são assíncronas)
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  // Verificando se o erro foi originado pela aplicação
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('🚀 Server started on port 3333!');
});
