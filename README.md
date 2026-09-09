# PokéManager API <img align="right" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/273.png" width="70"/>

API RESTful para gerenciamento de um catálogo de Pokémons, desenvolvida como projeto da disciplina de Tópicos Especiais em Engenharia de Software, seguindo os princípios da **Clean Architecture**.

## Tecnologias Utilizadas

- **Node.js** — ambiente de execução JavaScript
- **TypeScript** — superset tipado de JavaScript, compilado antes da execução
- **Express** — framework para construção de APIs HTTP
- **Swagger UI Express** + **swagger-autogen** — geração e exibição automática de documentação OpenAPI 3.0
- **tsx** — executor de TypeScript com hot-reload para desenvolvimento
- **ESLint + Prettier** — padronização e qualidade de código

## Arquitetura

O projeto segue **Clean Architecture**, organizado em 4 camadas concêntricas, onde camadas internas nunca dependem de camadas externas:

```
Domain  →  Application  →  Infrastructure  →  Main
(regras)   (casos de uso)   (detalhes técnicos)  (composição)
```

### Estrutura de Pastas (Entrega 1)

```
src/
├── domain/                          # Regras de negócio puras — sem dependências externas
│   ├── entities/
│   │   └── Pokemon.ts               # Entidade com validação de invariantes
│   ├── errors/
│   │   └── PokemonNotFoundError.ts  # Erro de domínio customizado
│   └── repositories/
│       └── PokemonRepository.ts     # Contrato (interface) do repositório
│
├── application/                     # Orquestração da lógica de negócio
│   ├── dtos/
│   │   ├── CreatePokemonDTO.ts
│   │   └── UpdatePokemonDTO.ts
│   └── use-cases/
│       ├── CreatePokemonUseCase.ts
│       ├── ListPokemonsUseCase.ts
│       ├── DeletePokemonUseCase.ts
│       ├── UpdatePokemonUseCase.ts
│       └── GetPokemonStatsUseCase.ts
│
├── infrastructure/                  # Implementações concretas de frameworks/bibliotecas
│   ├── database/in-memory/
│   │   └── InMemoryPokemonRepository.ts
│   └── http/controllers/
│       └── PokemonController.ts
│
└── main/                            # Ponto de entrada e composição das dependências
    ├── config/
    │   ├── swagger-generator.ts
    │   └── swagger-output.json
    └── server.ts
```

Essa separação segue o **Princípio de Inversão de Dependência**: trocar a persistência em memória por PostgreSQL, ou enriquecer a entidade com novos dados (status base, tier, learnset), exige apenas estender o Domain e adicionar novas implementações na Infrastructure — nenhuma linha de Use Case ou Controller já existente precisa mudar.

## Endpoints da API

Base URL: `http://localhost:3333/api/v1`

| Verbo    | Rota              | Descrição                                                   | Status de sucesso | Status de erro  |
| -------- | ----------------- | ----------------------------------------------------------- | ----------------- | --------------- |
| `POST`   | `/pokemons`       | Cadastra um novo Pokémon                                    | `201 Created`     | —               |
| `GET`    | `/pokemons`       | Lista todos os Pokémons                                     | `200 OK`          | —               |
| `GET`    | `/pokemons/stats` | Estatísticas gerais do catálogo (total e contagem por tipo) | `200 OK`          | —               |
| `PUT`    | `/pokemons/:id`   | Atualiza um Pokémon existente pelo ID                       | `200 OK`          | `404 Not Found` |
| `DELETE` | `/pokemons/:id`   | Remove um Pokémon pelo ID                                   | `204 No Content`  | `404 Not Found` |

### Exemplo de requisição — criar Pokémon

```http
POST /api/v1/pokemons
Content-Type: application/json

{
  "id": "1",
  "name": "Pikachu",
  "type": "Electric"
}
```

Resposta:
```json
{
  "message": "Pokémon cadastrado com sucesso!",
  "data": { "id": "1", "name": "Pikachu", "type": "Electric" }
}
```

### Exemplo de resposta — estatísticas

```json
{
  "totalPokemons": 4,
  "typesCount": {
    "Electric": 1,
    "Fire": 1,
    "Water": 2
  }
}
```

## Documentação Interativa (Swagger)

A API conta com documentação OpenAPI 3.0 gerada automaticamente a partir do código-fonte, evitando desatualização entre código e documentação (*Code-Doc Drift*).

Com o servidor rodando, acesse:
```
http://localhost:3333/api/docs
```

A documentação é regenerada automaticamente toda vez que o servidor é iniciado (`npm run dev`), através do `swagger-autogen`, que analisa as rotas registradas em `server.ts` e os comentários `#swagger.*` para montar o `swagger-output.json`.

## Como Executar o Projeto

### Pré-requisitos
- Node.js instalado

### Instalação

```bash
npm install
```

### Rodando em modo desenvolvimento

```bash
npm run dev
```

O servidor sobe em `http://localhost:3333`, e a documentação Swagger é gerada automaticamente antes da inicialização.

### Scripts disponíveis

```json
{
  "swagger": "tsx src/main/config/swagger-generator.ts",
  "dev": "npm run swagger && tsx watch src/main/server.ts",
  "build": "npm run swagger && tsc",
  "lint": "eslint src --ext .ts"
}
```
## Decisões de Projeto Relevantes

- **Validação na entidade, não no controller**: a regra "nome obrigatório" está no construtor da entidade `Pokemon`, garantindo que nenhum Pokémon inválido possa existir no sistema, independente de onde for criado.
- **Erros de domínio tipados**: `PokemonNotFoundError` permite ao Controller identificar precisamente o tipo de erro (`instanceof`) e traduzi-lo para o status HTTP correto, sem depender de comparação de mensagens de texto.
- **Ordem de rotas no Express**: `/pokemons/stats` é registrada antes de `/pokemons/:id`, pois o Express usa a primeira rota que casar com a URL — caso contrário, `"stats"` seria interpretado como um ID.
- **Injeção de dependência manual**: uma única instância do repositório é criada no `server.ts` (Composition Root) e compartilhada entre todos os Use Cases, garantindo que os dados fiquem consistentes entre as diferentes operações.

## Roadmap: Persistência, Integrações e correções:

### Correções:

1. Foco do nicho competitivo/Nuzlocke: adicionar **status base (base stats)** ao catálogo, priorizado por já estar disponível diretamente na PokéAPI (`hp`, `attack`, `defense`, `special-attack`, `special-defense`, `speed`).
2. Alterar o campo `type` para um array (alterar as instâncias de `type` no código). Cadastrar um dual type hoje é inviável.
3. Verificar inconsistências no código (como verificação de ids repetidos). 

