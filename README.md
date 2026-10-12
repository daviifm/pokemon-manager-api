# `manaAPI` <img align="right" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/490.png" width="200"/>

API RESTful para gerenciamento de um catálogo de Pokémons e de seus Treinadores, desenvolvida como projeto da disciplina de Tópicos Especiais em Engenharia de Software, seguindo os princípios da **Clean Architecture**.

Na Entrega 2, a API passou a **persistir os dados em PostgreSQL**, **validar toda entrada com Zod** e **buscar os dados oficiais na PokéAPI**: o cliente informa apenas o nome da espécie e o nível, e a API completa tipos, status base, sprite, experiência, altura e peso. Também foram adicionados os **Treinadores**, com a regra de negócio de que cada um carrega no máximo **6 Pokémons**.

## Tecnologias Utilizadas

- **Node.js** — ambiente de execução JavaScript
- **TypeScript** — superset tipado de JavaScript, compilado antes da execução
- **Express** — framework para construção de APIs HTTP
- **PostgreSQL** — banco de dados relacional
- **Prisma** — ORM que gera as consultas SQL e controla as migrations do banco
- **pg** — driver nativo do PostgreSQL, usado na versão do repositório com SQL escrito à mão
- **Zod** — validação dos dados de entrada (e das respostas da PokéAPI)
- **Axios** + **Cockatiel** — chamadas à PokéAPI com timeout, retry e circuit breaker
- **Docker / Docker Compose** — sobe o banco, as migrations, a API e o pgAdmin
- **Swagger UI Express** + **swagger-autogen** — geração e exibição automática de documentação OpenAPI 3.0
- **tsx** — executor de TypeScript com hot-reload para desenvolvimento
- **ESLint + Prettier** — padronização e qualidade de código

## Arquitetura

O projeto segue **Clean Architecture**, organizado em 4 camadas concêntricas, onde camadas internas nunca dependem de camadas externas:

```
Domain  →  Application  →  Infrastructure  →  Main
(regras)   (casos de uso)   (detalhes técnicos)  (composição)
```

### Estrutura de Pastas (Entrega 2)

```
prisma/
├── schema.prisma                        # Modelo das tabelas (trainers, pokemons)
├── migrations/                          # Histórico de mudanças do banco
└── sql/create-tables.sql                # Mesmo modelo em SQL puro (para o driver pg)

src/
├── domain/                              # Regras de negócio puras — sem dependências externas
│   ├── entities/
│   │   ├── pokemon.ts                   # Entidade com validação de invariantes (nível, tipos)
│   │   └── trainer.ts                   # Entidade + limite de 6 Pokémons por time
│   ├── value-objects/
│   │   ├── base-stats.ts                # Status base (1 a 255) + BST
│   │   └── pokemon-type.ts              # Os 18 tipos oficiais
│   ├── errors/                          # AppError → NotFoundError, ConflictError, ValidationError
│   ├── repositories/                    # Contratos (interfaces) de persistência
│   └── gateways/
│       └── pokemon-external-gateway.ts  # Contrato da fonte externa (PokéAPI)
│
├── application/                         # Orquestração da lógica de negócio
│   ├── dtos/
│   └── use-cases/                       # Pokémon: create, list, search, get, update,
│                                        #   update-level, delete, stats
│                                        # Treinador: create, list, get, update, delete
│                                        # ensure-team-has-room (regra dos 6)
│
├── infrastructure/                      # Implementações concretas de frameworks/bibliotecas
│   ├── database/
│   │   ├── prisma/                      # Repositórios com Prisma + tradutor de erros
│   │   ├── pg/                          # Repositórios com SQL puro + tradutor de erros
│   │   └── in-memory/                   # Repositórios em memória
│   ├── gateways/
│   │   ├── poke-api-axios-gateway.ts    # PokéAPI real (Axios + Zod + resiliência)
│   │   └── in-memory-pokemon-gateway.ts # PokéAPI simulada (sem internet)
│   └── http/
│       ├── routes/                      # Rotas + anotações do Swagger
│       ├── schemas/                     # Schemas Zod
│       ├── middlewares/                 # validate-request, async-handler, error-handler
│       └── controllers/                 # Controllers (sem try/catch) + presenters
│
└── main/                                # Ponto de entrada e composição das dependências
    ├── factories/                       # Composition Root: escolhe banco e gateway
    ├── config/
    │   ├── swagger-generator.ts
    │   └── swagger-output.json
    ├── app.ts                           # Monta o Express (middlewares, rotas, erros)
    └── server.ts                        # Só abre a porta
```

Essa separação segue o **Princípio de Inversão de Dependência**, e a Entrega 2 mostrou isso na prática: o repositório em memória foi trocado por PostgreSQL **sem alterar nenhum Use Case**. Hoje existem três implementações do mesmo contrato (Prisma, SQL puro com `pg` e memória), escolhidas por uma variável de ambiente.

## Endpoints da API

Base URL: `http://localhost:3333/api/v1`

### Pokémons

| Verbo    | Rota                     | Descrição                                                   | Status de sucesso | Status de erro          |
| -------- | ------------------------ | ----------------------------------------------------------- | ----------------- | ----------------------- |
| `POST`   | `/pokemons`              | Cadastra um Pokémon com os dados da PokéAPI                 | `201 Created`     | `400` `404` `409` `503` |
| `GET`    | `/pokemons`              | Lista com filtros e paginação                               | `200 OK`          | `400`                   |
| `GET`    | `/pokemons/search?name=` | Busca parcial pelo nome (ignora maiúsculas)                 | `200 OK`          | `400`                   |
| `GET`    | `/pokemons/stats`        | Estatísticas gerais do catálogo (total e contagem por tipo) | `200 OK`          | —                       |
| `GET`    | `/pokemons/:id`          | Busca um Pokémon pelo ID                                    | `200 OK`          | `400` `404`             |
| `PUT`    | `/pokemons/:id`          | Substitui nível e treinador                                 | `200 OK`          | `400` `404` `409`       |
| `PATCH`  | `/pokemons/:id/level`    | Atualiza só o nível                                         | `200 OK`          | `400` `404`             |
| `DELETE` | `/pokemons/:id`          | Remove um Pokémon pelo ID                                   | `204 No Content`  | `400` `404`             |

Filtros do `GET /pokemons`: `type`, `minLevel` (padrão 1), `maxLevel` (padrão 100), `trainerId`, `page` (padrão 1) e `limit` (padrão 10, máximo 50).

### Treinadores

| Verbo    | Rota            | Descrição                                              | Status de sucesso | Status de erro    |
| -------- | --------------- | ------------------------------------------------------ | ----------------- | ----------------- |
| `POST`   | `/trainers`     | Cadastra um treinador                                  | `201 Created`     | `400` `409`       |
| `GET`    | `/trainers`     | Lista todos os treinadores                             | `200 OK`          | —                 |
| `GET`    | `/trainers/:id` | Busca um treinador pelo ID                             | `200 OK`          | `400` `404`       |
| `PATCH`  | `/trainers/:id` | Atualiza parcialmente um treinador                     | `200 OK`          | `400` `404` `409` |
| `DELETE` | `/trainers/:id` | Remove o treinador (seus Pokémons ficam sem treinador) | `204 No Content`  | `400` `404`       |

### Exemplo de requisição — criar Pokémon

```http
POST /api/v1/pokemons
Content-Type: application/json

{
  "name": "Pikachu",
  "level": 10,
  "trainerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

Resposta (tipos, status, sprite e demais dados vieram da PokéAPI):
```json
{
  "message": "Pokémon cadastrado com sucesso!",
  "data": {
    "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "pokedexNumber": 25,
    "name": "pikachu",
    "types": ["electric"],
    "level": 10,
    "baseStats": {
      "hp": 35, "attack": 55, "defense": 40,
      "specialAttack": 50, "specialDefense": 50, "speed": 90,
      "total": 320
    },
    "trainerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "spriteUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    "baseExperience": 112,
    "height": 4,
    "weight": 60
  }
}
```

### Exemplo de resposta — listagem paginada

```json
{
  "data": [ ... ],
  "meta": { "page": 1, "limit": 10, "total": 45 }
}
```

### Exemplo de resposta — estatísticas

Pokémons de tipo duplo (ex: Bulbasaur, `grass` + `poison`) contam nos dois tipos:

```json
{
  "totalPokemons": 3,
  "typesCount": {
    "electric": 1,
    "grass": 1,
    "poison": 1,
    "fire": 1
  }
}
```

### Formato dos erros

Todos os erros passam por um middleware global e saem sempre no mesmo formato:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Dados de entrada inválidos",
  "details": [
    { "field": "name", "message": "O nome deve ter no mínimo 2 caracteres" },
    { "field": "level", "message": "O nível deve ser no máximo 100" }
  ]
}
```

| Status | Quando acontece                                                                     |
| ------ | ----------------------------------------------------------------------------------- |
| `400`  | Dados inválidos (Zod), ID que não é UUID, treinador inexistente, JSON malformado    |
| `404`  | Pokémon, treinador ou rota inexistente; espécie não existe na PokéAPI               |
| `409`  | E-mail de treinador repetido; time do treinador já tem 6 Pokémons                   |
| `500`  | Erro inesperado: responde `"Erro interno no servidor."`, e o detalhe fica só no log |
| `503`  | PokéAPI fora do ar ou lenta demais                                                  |

## Documentação Interativa (Swagger)

A API conta com documentação OpenAPI 3.0 gerada automaticamente a partir do código-fonte, evitando desatualização entre código e documentação (*Code-Doc Drift*).

Com o servidor rodando, acesse:
```
http://localhost:3333/api/docs
```

A documentação é regenerada automaticamente toda vez que o servidor é iniciado (`npm run dev`), através do `swagger-autogen`, que analisa as rotas em `infrastructure/http/routes/` e os comentários `#swagger.*` para montar o `swagger-output.json`. As rotas estão agrupadas nas tags **Pokemons** e **Trainers**.

## Como Executar o Projeto

### Pré-requisitos
- Node.js instalado
- Docker (com Docker Compose)

### Opção 1: tudo no Docker

```bash
cp .env.example .env
docker compose up --build
```

O Docker sobe o PostgreSQL, cria as tabelas (serviço `migrate`) e só então inicia a API.

- API: `http://localhost:3333`
- Swagger: `http://localhost:3333/api/docs`
- pgAdmin: `http://localhost:8080` (login no `.env`)

### Opção 2: API na máquina, banco no Docker

```bash
npm install
cp .env.example .env
docker compose up -d postgres pgadmin
npx prisma migrate dev
npm run dev
```

### Variáveis de ambiente principais

| Variável           | Valores                             | Efeito                                         |
| ------------------ | ----------------------------------- | ---------------------------------------------- |
| `DB_DRIVER`        | `prisma` (padrão), `pg` ou `memory` | Qual implementação de banco a API usa          |
| `USE_EXTERNAL_API` | `true` (padrão) ou `false`          | `false` usa uma PokéAPI simulada, sem internet |
| `DATABASE_URL`     | URL do PostgreSQL                   | Conexão com o banco                            |

Para testar sem banco e sem internet:

```bash
DB_DRIVER=memory USE_EXTERNAL_API=false npm run dev
```

### Scripts disponíveis

```json
{
  "swagger": "tsx src/main/config/swagger-generator.ts",
  "dev": "npm run swagger && tsx watch src/main/server.ts",
  "build": "npm run swagger && tsc && tsc-alias",
  "lint": "eslint src --ext .ts",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev"
}
```

## Decisões de Projeto Relevantes

- **Validação em camadas**: o **Zod** confere o formato dos dados na entrada da API e devolve todos os erros de uma vez, campo a campo; a **entidade** garante as regras do jogo (nível de 1 a 100, 1 ou 2 tipos, status de 1 a 255), venha o dado de onde vier; regras que dependem do estado do sistema, como o limite de 6 Pokémons por time, ficam nos **Use Cases**.
- **Tratamento global de erros**: os erros do domínio (`NotFoundError`, `ConflictError`, `ValidationError`) carregam um código sugerido, os controllers não têm `try/catch` e um único middleware (`error-handler.ts`) transforma qualquer erro em resposta HTTP padronizada. Erros nativos do banco (e-mail repetido, treinador inexistente, registro não encontrado) são traduzidos para 409, 400 e 404.
- **Integração com a PokéAPI via Gateway**: o Use Case conhece apenas a interface `PokemonExternalGateway`. A implementação com Axios valida a resposta externa com Zod e traduz os nomes da PokéAPI (`special-attack` → `specialAttack`) para o formato do domínio, isolando o sistema de mudanças externas. Ela também tem timeout (3 s), retry com espera crescente e circuit breaker; se a PokéAPI cair, a API responde `503`.
- **ID gerado pelo servidor**: cada Pokémon recebe um UUID, o que resolve a questão dos IDs repetidos e permite ter o mesmo Pikachu em times diferentes. O número da Pokédex virou o campo `pokedexNumber`.
- **Integridade garantida pelo banco**: e-mail único (`UNIQUE`), treinador válido (chave estrangeira) e, ao apagar um treinador, seus Pokémons ficam sem treinador (`ON DELETE SET NULL`), dentro de uma transação.
- **SQL seguro**: no repositório com o driver `pg`, todas as consultas usam parâmetros (`$1`, `$2`), nunca concatenação de texto, prevenindo SQL Injection.
- **Ordem de rotas no Express**: `/pokemons/stats` e `/pokemons/search` são registradas antes de `/pokemons/:id`, pois o Express usa a primeira rota que casar com a URL.
- **Composition Root**: as factories em `main/factories/` são o único lugar que escolhe as implementações concretas (Prisma, `pg` ou memória; PokéAPI real ou simulada).

## Correções da Entrega 1 (concluídas)

1. ✅ **Status base (base stats)** adicionados ao catálogo, com o BST calculado, vindos direto da PokéAPI.
2. ✅ **`type` virou `types` (lista)**: Pokémons de tipo duplo agora são representados corretamente.
3. ✅ **IDs repetidos**: o ID passou a ser gerado pelo servidor (UUID), e não mais enviado pelo cliente.
4. ✅ **Rotas fora do `server.ts`**: movidas para `infrastructure/http/routes/`.

## Roadmap: Autenticação e Segurança (Entrega 3)

1. Autenticação com JWT.
2. Segurança seguindo as recomendações da OWASP.
3. Controle de acesso por perfil (RBAC).
4. Nicho competitivo: tier da Smogon e learnset por nível, integrados por um novo Gateway, já que esses dados não existem na PokéAPI.
