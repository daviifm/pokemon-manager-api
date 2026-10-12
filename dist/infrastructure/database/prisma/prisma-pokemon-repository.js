"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPokemonRepository = void 0;
const pokemon_1 = require("@domain/entities/pokemon");
const client_1 = require("./client");
// Mappers: traduzem entre o "formato do banco" (linha da tabela) e o
// "formato do domínio" (entidade). O resto do sistema nunca vê o PokemonRow.
function toDomain(row) {
    return new pokemon_1.Pokemon({
        id: row.id,
        name: row.name,
        types: row.types,
        baseStats: {
            hp: row.hp,
            attack: row.attack,
            defense: row.defense,
            specialAttack: row.specialAttack,
            specialDefense: row.specialDefense,
            speed: row.speed,
        },
        spriteUrl: row.spriteUrl,
    });
}
function toPersistence(pokemon) {
    return {
        id: pokemon.id,
        name: pokemon.name,
        types: [...pokemon.types],
        hp: pokemon.baseStats.hp,
        attack: pokemon.baseStats.attack,
        defense: pokemon.baseStats.defense,
        specialAttack: pokemon.baseStats.specialAttack,
        specialDefense: pokemon.baseStats.specialDefense,
        speed: pokemon.baseStats.speed,
        spriteUrl: pokemon.spriteUrl,
    };
}
class PrismaPokemonRepository {
    async create(pokemon) {
        await client_1.prisma.pokemon.create({ data: toPersistence(pokemon) });
    }
    async findAll(filters) {
        const rows = await client_1.prisma.pokemon.findMany({
            // `has` é o operador do Prisma para "a lista contém este valor"
            where: filters?.type ? { types: { has: filters.type } } : undefined,
            orderBy: { id: 'asc' },
        });
        return rows.map(toDomain);
    }
    async findById(id) {
        const row = await client_1.prisma.pokemon.findUnique({ where: { id } });
        return row ? toDomain(row) : null;
    }
    async update(pokemon) {
        const { id, ...data } = toPersistence(pokemon);
        await client_1.prisma.pokemon.update({ where: { id }, data });
    }
    async delete(id) {
        await client_1.prisma.pokemon.delete({ where: { id } });
    }
}
exports.PrismaPokemonRepository = PrismaPokemonRepository;
