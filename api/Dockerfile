# Dockerfile para API NestJS
FROM node:20-alpine AS builder

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN pnpm prisma generate

# Build da aplicação
RUN pnpm build

# Produção
FROM node:20-alpine

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Instalar apenas dependências de produção
RUN pnpm install --prod --frozen-lockfile

# Gerar Prisma Client
RUN pnpm prisma generate

# Copiar build do stage anterior
COPY --from=builder /app/dist ./dist

# Expor porta
EXPOSE 3000

# Comando para iniciar
CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/main"]
