// src/domain/errors/app-error.ts
// Classe base de todos os erros OPERACIONAIS (previsíveis) da aplicação.
// Ela não conhece HTTP/Express: só carrega uma mensagem, um código de status
// sugerido e detalhes opcionais. Quem traduz isso em resposta é o errorHandler.
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.details = details;
  }
}
