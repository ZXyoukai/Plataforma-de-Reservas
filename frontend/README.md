# Frontend - Aplicação Web

Aplicação web desenvolvida com React e Vite para a Plataforma de Reservas.

## 🛠️ Stack Tecnológica

- **Framework:** React 19
- **Build Tool:** Vite
- **Linguagem:** TypeScript
- **Estilização:** TailwindCSS
- **HTTP Client:** Axios
- **State Management:** Zustand
- **Roteamento:** React Router

## �� Estrutura do Projeto

```
frontend/
├── public/                    # Arquivos estáticos
├── src/
│   ├── assets/               # Imagens, fontes, etc.
│   ├── components/           # Componentes reutilizáveis
│   │   └── ProtectedRoute.tsx
│   ├── pages/                # Páginas da aplicação
│   │   ├── BrowseServicesPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ...
│   ├── services/             # Serviços de API
│   ├── store/                # Zustand stores
│   ├── types/                # TypeScript types
│   ├── App.tsx               # Componente principal
│   ├── main.tsx              # Ponto de entrada
│   └── index.css             # Estilos globais
├── Dockerfile                # Configuração Docker
├── nginx.conf                # Configuração Nginx
├── tailwind.config.js        # Config TailwindCSS
├── vite.config.ts            # Config Vite
└── package.json
```

## 🚀 Como Executar

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar variável de ambiente (opcional)
echo "VITE_API_URL=http://localhost:3000" > .env

# Rodar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Com Docker

```bash
# Build da imagem
docker build -t plataforma-frontend .

# Executar container
docker run -p 80:80 plataforma-frontend
```

A aplicação estará disponível em:
- Desenvolvimento: `http://localhost:5173`
- Produção (Docker): `http://localhost:80`

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto frontend:

```env
VITE_API_URL=http://localhost:3000
```

## 🎨 Páginas Principais

### Públicas
- `/login` - Login de usuários
- `/register` - Registro de novos usuários

### Protegidas (Requerem autenticação)
- `/` - Dashboard principal
- `/services` - Navegação de serviços disponíveis
- `/my-services` - Gestão de serviços (SERVICE_PROVIDER)
- `/my-reservations` - Minhas reservas (CLIENT)
- `/service-reservations/:id` - Reservas de um serviço específico

## 🔐 Autenticação

O sistema utiliza JWT tokens armazenados no localStorage. O componente `ProtectedRoute` garante que apenas usuários autenticados acessem rotas protegidas.

## 🎯 Funcionalidades

### Para Clientes (CLIENT)
- Navegar serviços disponíveis
- Fazer reservas de serviços
- Visualizar histórico de reservas
- Gerenciar créditos

### Para Prestadores (SERVICE_PROVIDER)
- Cadastrar novos serviços
- Editar serviços existentes
- Visualizar reservas recebidas
- Confirmar/cancelar reservas
- Dashboard com estatísticas

## 📦 Dependências Principais

- `react` - Framework UI
- `react-router-dom` - Roteamento
- `axios` - HTTP Client
- `zustand` - State Management
- `tailwindcss` - Estilização

## 🔧 Scripts Disponíveis

```bash
npm run dev       # Servidor de desenvolvimento
npm run build     # Build para produção
npm run preview   # Preview do build de produção
npm run lint      # Executar ESLint
```

## 🐳 Docker

O Dockerfile usa multi-stage build:

1. **Build stage:** Compila a aplicação com Vite
2. **Production stage:** Serve os arquivos estáticos com Nginx

A configuração Nginx está otimizada para SPAs.

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- Desktop (1920px+)
- Tablet (768px - 1919px)
- Mobile (320px - 767px)
