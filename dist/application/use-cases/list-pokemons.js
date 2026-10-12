"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPokemonsUseCase = void 0;
class ListPokemonsUseCase {
    pokemonRepository;
    constructor(pokemonRepository) {
        this.pokemonRepository = pokemonRepository;
    }
    async execute(filters) {
        const { items, total } = await this.pokemonRepository.findAll(filters);
        return {
            data: items,
            meta: { page: filters.page, limit: filters.limit, total },
        };
    }
}
exports.ListPokemonsUseCase = ListPokemonsUseCase;
