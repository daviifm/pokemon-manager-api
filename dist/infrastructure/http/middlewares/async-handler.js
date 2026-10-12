"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
// Repassa qualquer erro (throw/reject) de um handler async para o errorHandler
// global. Assim os controllers ficam SEM try/catch. (O Express 5 já faz isso
// sozinho, mas mantemos o wrapper para funcionar igual no Express 4.)
const asyncHandler = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
};
exports.asyncHandler = asyncHandler;
