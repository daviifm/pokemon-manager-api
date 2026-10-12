// src/main/app.ts
// Monta a aplicação Express (middlewares + rotas), mas NÃO sobe o servidor.
// Separar app de server facilita testes: dá para importar o `app` sem abrir porta.
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from './config/swagger-output.json';
import { routes } from '../infrastructure/http/routes';
import { AppError } from '@domain/errors/app-error';
import { errorHandler } from '@infrastructure/http/middlewares/error-handler';

const app = express();

app.use(express.json());

// Documentação interativa (Swagger UI)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

// Rotas da API (versionadas)
app.use('/api/v1', routes);

// Rota inexistente: devolve o MESMO formato de erro da API (em vez do HTML padrão do Express)
app.use((req, _res, next) => {
  next(
    new AppError(`Rota ${req.method} ${req.originalUrl} não encontrada`, 404),
  );
});

// 🛑 O Middleware Global de Erros DEVE ser a ÚLTIMA declaração do app!
app.use(errorHandler);

export { app };
