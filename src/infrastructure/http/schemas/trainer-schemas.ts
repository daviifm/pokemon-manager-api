// src/infrastructure/http/schemas/trainer-schemas.ts
import { z } from 'zod';

const nameSchema = z
  .string({
    required_error: 'O nome é obrigatório',
    invalid_type_error: 'O nome deve ser um texto',
  })
  .trim()
  .min(3, 'O nome deve ter no mínimo 3 caracteres');

const emailSchema = z
  .string({
    required_error: 'O e-mail é obrigatório',
    invalid_type_error: 'O e-mail deve ser um texto',
  })
  .trim()
  .toLowerCase()
  .email('E-mail inválido');

const citySchema = z
  .string({
    required_error: 'A cidade é obrigatória',
    invalid_type_error: 'A cidade deve ser um texto',
  })
  .trim()
  .min(2, 'A cidade deve ter no mínimo 2 caracteres');

export const createTrainerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  city: citySchema,
});

// PATCH: todos os campos opcionais, mas ao menos um precisa vir.
export const updateTrainerSchema = z
  .object({
    name: nameSchema.optional(),
    email: emailSchema.optional(),
    city: citySchema.optional(),
  })
  .refine((body) => Object.keys(body).length > 0, {
    message: 'Informe ao menos um campo para atualizar (name, email ou city)',
  });

export type CreateTrainerInput = z.infer<typeof createTrainerSchema>;
export type UpdateTrainerInput = z.infer<typeof updateTrainerSchema>;
