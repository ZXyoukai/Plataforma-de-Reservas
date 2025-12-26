# Plataforma de Reservas

Sistema completo de gerenciamento de reservas de serviços com autenticação de usuários, permitindo que prestadores de serviços cadastrem seus serviços e clientes façam reservas.

## 🌐 Links de Acesso

### 🖥️ Aplicação Web
**[https://plataforma-de-reservas-web.onrender.com](https://plataforma-de-reservas-web.onrender.com)**

### 📚 API e Documentação
**API Base URL:** `https://plataforma-de-reservas.onrender.com`  
**Documentação Swagger:** **[https://plataforma-de-reservas.onrender.com/api/docs](https://plataforma-de-reservas.onrender.com/api/docs)**

### 📱 Aplicação Mobile (APK)
**[Download APK Android v1.0.0](https://drive.google.com/file/d/1siCRZanf-0QJl1U9CfdLaSHB5KZ-1wYr/view?usp=sharing)**

---

## 🏗️ Estrutura do Projeto

Este repositório contém três aplicações principais:

```
Plataforma-de-Reservas/
├── backend/          # API REST (NestJS + Prisma + PostgreSQL)
├── frontend/         # Aplicação Web (React + Vite + TypeScript)
├── mobile/           # Aplicação Mobile (React Native + Expo)
└── README.md
```

### 📁 Backend (`/backend`)

**Stack:**
- NestJS 11.x
- Prisma ORM 5.22.0
- PostgreSQL (Neon Database)
- TypeScript
- JWT Authentication
- Bcrypt para hash de senhas
- Swagger/OpenAPI

**Principais Features:**
- Autenticação e autorização com JWT
- CRUD de usuários (Clientes e Prestadores de Serviço)
- CRUD de serviços
- Sistema de reservas
- Gestão de créditos
- Validação de dados com class-validator
- Documentação automática com Swagger

### 🌐 Frontend (`/frontend`)

**Stack:**
- React 19
- Vite
- TypeScript
- TailwindCSS
- Axios
- Zustand (gerenciamento de estado)
- React Router

**Principais Features:**
- Interface para navegação e reserva de serviços
- Dashboard para prestadores de serviço
- Gestão de reservas
- Sistema de autenticação
- Design responsivo

### 📱 Mobile (`/mobile`)

**Stack:**
- React Native
- Expo SDK 54
- TypeScript
- React Navigation
- Axios
- Zustand (gerenciamento de estado)
- Expo Secure Store

**Principais Features:**
- Login e registro de usuários
- Navegação de serviços disponíveis
- Criação e gestão de reservas
- Dashboard personalizado por tipo de usuário
- Armazenamento seguro de credenciais

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 20.x
- Docker e Docker Compose (para containers)
- pnpm (para backend)
- npm (para frontend e mobile)

### Backend

```bash
cd backend

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais

# Gerar Prisma Client
pnpm prisma generate

# Executar migrações
pnpm prisma migrate deploy

# Rodar em desenvolvimento
pnpm start:dev

# Ou com Docker
docker build -t plataforma-backend .
docker run -p 3000:3000 plataforma-backend
```

A API estará disponível em `http://localhost:3000`
Documentação Swagger: `http://localhost:3000/api`

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Ou com Docker
docker build -t plataforma-frontend .
docker run -p 80:80 plataforma-frontend
```

A aplicação web estará disponível em `http://localhost:5173` (dev) ou `http://localhost:80` (prod)

### Mobile

```bash
cd mobile

# Instalar dependências
npm install

# Configurar URL da API no arquivo src/config.ts

# Iniciar Expo
npm start

# Rodar no Android
npm run android

# Rodar no iOS
npm run ios

# Build APK com EAS
npx eas build --platform android --profile preview
```

---

## 📝 Variáveis de Ambiente

### Backend (.env)

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="sua-chave-secreta"
JWT_EXPIRES_IN="24h"
PORT=3000
NODE_ENV=development
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
BCRYPT_SALT_ROUNDS=10
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

### Mobile (src/config.ts)

```typescript
export const API_URL = 'http://seu-ip:3000';
```

---

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação. Existem dois tipos de usuários:

1. **CLIENT** - Clientes que fazem reservas
2. **SERVICE_PROVIDER** - Prestadores que oferecem serviços

### Endpoints principais:

- `POST /auth/register` - Registro de novo usuário
- `POST /auth/login` - Login (retorna token JWT)
- `GET /auth/profile` - Obter perfil do usuário autenticado

---

## 🗄️ Banco de Dados

O projeto utiliza PostgreSQL com Prisma ORM. O schema inclui:

- **User** - Usuários do sistema
- **Service** - Serviços oferecidos
- **Reservation** - Reservas realizadas

Para visualizar o banco de dados:

```bash
cd backend
pnpm prisma studio
```

---

## 📦 Dockerfiles

Cada aplicação possui seu próprio Dockerfile otimizado:

- **Backend**: Multi-stage build com Node.js Slim
- **Frontend**: Build com Node + servido com Nginx
- **Mobile**: Não necessita Docker (usa Expo)

---

## 🧪 Testes

```bash
# Backend
cd backend
pnpm test

# Frontend
cd frontend
npm run test

# Mobile
cd mobile
npm run test
```

---

## 📄 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.

---

## 👥 Autor

Domingos Germano Franco

---

## 📞 Contato

Para dúvidas ou sugestões sobre o projeto, entre em contato através do GitHub.
