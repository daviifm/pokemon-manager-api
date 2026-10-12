"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaErrorMapper = void 0;
const app_error_1 = require("../../../domain/errors/app-error.js");
const conflict_error_1 = require("../../../domain/errors/conflict-error.js");
const not_found_error_1 = require("../../../domain/errors/not-found-error.js");
// Nome do model do Prisma -> nome em português para a mensagem
const ENTITY_LABELS = {
    Trainer: 'Treinador',
    Pokemon: 'Pokémon',
};
class PrismaErrorMapper {
    static toAppError(error) {
        switch (error.code) {
            case 'P2002': {
                // Violação de constraint única (ex: e-mail de treinador repetido)
                const target = Array.isArray(error.meta?.target)
                    ? (error.meta?.target).join(', ')
                    : 'campo';
                return new conflict_error_1.ConflictError(`Já existe um registro cadastrado com este ${target}`);
            }
            case 'P2025': {
                // Registro não encontrado para atualização ou exclusão
                const model = String(error.meta?.modelName ?? '');
                const entity = ENTITY_LABELS[model] ?? 'Registro';
                return new not_found_error_1.NotFoundError(`${entity} não encontrado no banco de dados`);
            }
            case 'P2003': {
                // Violação de chave estrangeira (ex: trainerId que não existe)
                return new app_error_1.AppError('Relacionamento inválido. O recurso associado não existe', 400);
            }
            default:
                return new app_error_1.AppError('Erro ao processar operação no banco de dados', 500);
        }
    }
}
exports.PrismaErrorMapper = PrismaErrorMapper;
