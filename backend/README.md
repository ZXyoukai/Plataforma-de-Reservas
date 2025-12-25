# Backend - API REST

API REST desenvolvida com NestJS para gerenciamento de reservas de serviços.

## 🛠️ Stack Tecnológica

- **Framework:** NestJS 11.x
- **ORM:** Prisma 5.22.0
- **Banco de Dados:** PostgreSQL (Neon)
- **Autenticação:** JWT + Passport
- **Validação:** class-validator + class-transformer
- **Documentação:** Swagger/OpenAPI
- **Hash de Senhas:** Bcrypt

## 📁 Estrutura do Projeto

```
backend/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── migrations/            # Migrações do Prisma
├── src/
│   ├── config/                # Configurações da aplicação
│   ├── controllers/           # Controllers HTTP
│   ├── core/                  # Lógica de negócio core
│   ├── database/              # Módulo e serviço do Prisma
│   ├── entities/              # Entidades do domínio
│   ├── interfaces/            # Interfaces e contratos
│   ├── modules/               # Módulos da aplicação
│   │   ├── auth/              # Autenticação
│   │   ├── user-registration/ # Registro de usuários
│   │   ├── service/           # Gestão de serviços
│   │   ├── reservation/       # Sistema de reservas
│   │   └── manage/            # Gestão administrativa
│   ├── providers/             # Provedores customizados
│   ├── repositories/          # Repositórios de dados
│   ├── services/              # Serviços da aplicação
│   └── main.ts                # Ponto de entrada
├── Dockerfile                 # Configuração Docker
└── package.json
```

## 🚀 Como Executar

### Desenvolvimento Local

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env

# Gerar Prisma Client
pnpm prisma generate

# Executar migrações
pnpm prisma migrate deploy

# Rodar em modo desenvolvimento
pnpm start:dev

# Build para produção
pnpm build

# Rodar em produção
pnpm start:prod
```

### Com Docker

```bash
# Build da imagem
docker build -t plataforma-backend .

# Executar container
docker run -p 3000:3000 --env-file .env plataforma-backend
```

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto backend:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="sua-chave-secreta-muito-segura"
JWT_EXPIRES_IN="24h"
PORT=3000
NODE_ENV=development
CORS_ORIGINS="http://localhost:3000,http://localhost:5173"
BCRYPT_SALT_ROUNDS=10
```

## 📚 Documentação da API

Após iniciar o servidor, acesse:

- **Swagger UI:** `http://localhost:3000/api`
- **OpenAPI JSON:** `http://localhost:3000/api-json`

## 🔐 Endpoints Principais

### Autenticação

```
POST   /auth/register    # Registrar novo usuário
POST   /auth/login       # Fazer login
GET    /auth/profile     # Obter perfil do usuário autenticado
```

### Usuários

```
GET    /users           # Listar todos os usuários
GET    /users/:id       # Obter usuário por ID
PATCH  /users/:id       # Atualizar usuário
DELETE /users/:id       # Deletar usuário
```

### Serviços

```
GET    /services        # Listar todos os serviços
GET    /services/:id    # Obter serviço por ID
POST   /services        # Criar novo serviço (SERVICE_PROVIDER)
PATCH  /services/:id    # Atualizar serviço
DELETE /services/:id    # Deletar serviço
```

### Reservas

```
GET    /reservations         # Listar reservas do usuário
GET    /reservations/:id     # Obter reserva por ID
POST   /reservations         # Criar nova reserva (CLIENT)
PATCH  /reservations/:id     # Atualizar status da reserva
DELETE /reservations/:id     # Cancelar reserva
```

## 🗄️ Schema do Banco de Dados

### User
- id (UUID)
- email (único)
- nif (único)
- password (hash)
- name
- credit (Decimal)
- role (CLIENT | SERVICE_PROVIDER)
- createdAt
- updatedAt

### Service
- id (UUID)
- name
- description
- price (Decimal)
- providerId (FK -> User)
- createdAt
- updatedAt

### Reservation
- id (UUID)
- serviceId (FK -> Service)
- clientId (FK -> User)
- status (PENDING | CONFIRMED | CANCELLED | COMPLETED)
- reservationDate
- createdAt
- updatedAt

## 🧪 Testes

```bash
# Testes unitários
pnpm test

# Testes e2e
pnpm test:e2e

# Cobertura de testes
pnpm test:cov
```

## 🔧 Scripts Úteis

```bash
# Abrir Prisma Studio (GUI do banco)
pnpm prisma studio

# Criar nova migration
pnpm prisma migrate dev --name nome_da_migration

# Resetar banco de dados
pnpm prisma migrate reset

# Formatar código
pnpm format

# Lint
pnpm lint
```

## 📦 Dependências Principais

- `@nestjs/core` - Framework core
- `@nestjs/jwt` - JWT authentication
- `@nestjs/passport` - Passport integration
- `@nestjs/swagger` - API documentation
- `@prisma/client` - Prisma ORM client
- `bcrypt` - Password hashing
- `class-validator` - Validation
- `passport-jwt` - JWT strategy

## 🐳 Docker

O Dockerfile usa multi-stage build para otimizar o tamanho da imagem:

1. **Builder stage:** Instala dependências e compila o código
2. **Production stage:** Copia apenas os arquivos necessários

A imagem final é baseada em `node:20-slim` com OpenSSL para compatibilidade com Prisma.
