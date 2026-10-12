// src/application/dtos/trainer-dtos.ts
export interface CreateTrainerDTO {
  name: string;
  email: string;
  city: string;
}

export interface UpdateTrainerDTO {
  name?: string;
  email?: string;
  city?: string;
}
