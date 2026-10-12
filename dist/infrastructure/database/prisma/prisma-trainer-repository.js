"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaTrainerRepository = void 0;
const trainer_1 = require("../../../domain/entities/trainer.js");
const client_1 = require("./client");
function toDomain(row) {
    return new trainer_1.Trainer({
        id: row.id,
        name: row.name,
        email: row.email,
        city: row.city,
    });
}
class PrismaTrainerRepository {
    // E-mail repetido => Prisma lança P2002 => PrismaErrorMapper => 409
    async create(trainer) {
        await client_1.prisma.trainer.create({
            data: {
                id: trainer.id,
                name: trainer.name,
                email: trainer.email,
                city: trainer.city,
            },
        });
    }
    async findAll() {
        const rows = await client_1.prisma.trainer.findMany({
            orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        });
        return rows.map(toDomain);
    }
    async findById(id) {
        const row = await client_1.prisma.trainer.findUnique({ where: { id } });
        return row ? toDomain(row) : null;
    }
    async update(trainer) {
        await client_1.prisma.trainer.update({
            where: { id: trainer.id },
            data: { name: trainer.name, email: trainer.email, city: trainer.city },
        });
    }
    // Transação (tudo ou nada): solta os Pokémons e só então remove o treinador.
    // Id inexistente => `delete` lança P2025 => a transação inteira é desfeita
    // e o PrismaErrorMapper responde 404.
    async delete(id) {
        await client_1.prisma.$transaction([
            client_1.prisma.pokemon.updateMany({
                where: { trainerId: id },
                data: { trainerId: null },
            }),
            client_1.prisma.trainer.delete({ where: { id } }),
        ]);
    }
}
exports.PrismaTrainerRepository = PrismaTrainerRepository;
