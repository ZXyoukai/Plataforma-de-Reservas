import { useAuthStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types/auth.types';
import { useState } from 'react';

export const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    // Pequeno delay para animação suave
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark">
      {/* Header */}
      <header className="bg-dark-light border-b border-dark-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold">Plataforma de Reservas</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.role === 'SERVICE_PROVIDER' ? 'Prestador' : 'Cliente'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="btn-outline py-2 px-4 text-sm transition-opacity duration-300"
                disabled={isLoggingOut}
                style={{ opacity: isLoggingOut ? 0.5 : 1 }}
              >
                {isLoggingOut ? 'Saindo...' : 'Sair'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Bem-vindo à nossa Plataforma de Reservas, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Saldo */}
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-400">Saldo Disponível</h3>
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-primary">{user?.credit?.toFixed(2)} AOA</p>
          </div>

          {/* Card Email */}
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-400">E-mail</h3>
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium break-all">{user?.email}</p>
          </div>

          {/* Card NIF */}
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-400">NIF</h3>
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <p className="text-lg font-medium">{user?.nif}</p>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user?.role === UserRole.SERVICE_PROVIDER ? (
              <button
                onClick={() => navigate('/services')}
                className="card hover:border-primary/50 transition cursor-pointer text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Gerenciar Serviços</h3>
                    <p className="text-gray-400 text-sm">Crie e edite seus serviços</p>
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => navigate('/browse-services')}
                className="card hover:border-primary/50 transition cursor-pointer text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Contratar Serviços</h3>
                    <p className="text-gray-400 text-sm">Explore e contrate serviços</p>
                  </div>
                </div>
              </button>
            )}
            
            {/* Histórico de Transações - Disponível para todos */}
            <button
              onClick={() => navigate('/transactions')}
              className="card hover:border-primary/50 transition cursor-pointer text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Histórico</h3>
                  <p className="text-gray-400 text-sm">Ver todas as transações</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Informações */}
        <div className="mt-8">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">
              {user?.role === 'SERVICE_PROVIDER' ? 'Para Prestadores' : 'Para Clientes'}
            </h2>
            <p className="text-gray-400">
              {user?.role === 'SERVICE_PROVIDER' 
                ? 'Gerencie seus serviços, visualize reservas e acompanhe seus ganhos.'
                : 'Explore os serviços disponíveis, faça reservas e gerencie seu saldo.'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
