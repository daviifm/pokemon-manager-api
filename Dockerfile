# ==========================================
# Estágio 1: Build (Compilação do TypeScript)
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# O Prisma precisa do OpenSSL no Alpine
RUN apk add --no-cache openssl

# Copia os arquivos de dependências
COPY package*.json ./

# Instala todas as dependências (incluindo devDependencies para compilar)
RUN npm ci

# Copia o código-fonte e configurações (inclui a pasta prisma/)
COPY . .

# Gera o Prisma Client a partir do schema.prisma (ANTES de compilar)
RUN npx prisma generate

# Gera o swagger-output.json, compila o TypeScript e resolve os aliases (@domain/...)
RUN npm run build

# ==========================================
# Estágio 2: Runner (Ambiente de Execução)
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN apk add --no-cache openssl

# Copia apenas os arquivos de manifesto de pacotes
COPY package*.json ./

# Instala APENAS as dependências de produção para reduzir o tamanho da imagem
RUN npm ci --omit=dev

# O Prisma Client é GERADO (não vem no npm ci): copiamos do estágio de build
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Copia a pasta /dist gerada no estágio de build
# (o swagger-output.json já vai junto: o tsc o copia por ser importado no app.ts)
COPY --from=builder /usr/src/app/dist ./dist

# Expõe a porta onde o Express escuta
EXPOSE 3333

# Comando para subir o servidor em produção
CMD ["node", "dist/main/server.js"]
