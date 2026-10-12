"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// src/main/app.ts
// Monta a aplicação Express (middlewares + rotas), mas NÃO sobe o servidor.
// Separar app de server facilita testes: dá para importar o `app` sem abrir porta.
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("./config/swagger-output.json"));
const routes_1 = require("../infrastructure/http/routes");
const app_error_1 = require("../domain/errors/app-error.js");
const error_handler_1 = require("../infrastructure/http/middlewares/error-handler.js");
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
// Health check simples (fora do Swagger)
app.get('/', (_req, res) => {
    // #swagger.ignore = true
    res.status(200).json({
        status: 'ok',
        message: 'PokéManager API no ar',
        docs: '/api/docs',
    });
});
// Atalho: /swagger leva para a documentação oficial em /api/docs
app.get('/swagger', (_req, res) => {
    // #swagger.ignore = true
    res.redirect('/api/docs');
});
// Documentação interativa (Swagger UI)
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default));
// Rotas da API (versionadas)
app.use('/api/v1', routes_1.routes);
// Rota inexistente: devolve o MESMO formato de erro da API (em vez do HTML padrão do Express)
app.use((req, _res, next) => {
    next(new app_error_1.AppError(`Rota ${req.method} ${req.originalUrl} não encontrada`, 404));
});
// 🛑 O Middleware Global de Erros DEVE ser a ÚLTIMA declaração do app!
app.use(error_handler_1.errorHandler);
