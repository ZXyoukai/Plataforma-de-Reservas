import { useAuthStore } from '../store/auth.store';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
              <span className="text-xl font-bold">Bulir</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="btn-outline py-2 px-4 text-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Bem-vindo à plataforma Bulir, {user?.name}!</p>
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
            <p className="text-lg font-medium">{user?.email}</p>
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

        {/* Próximas funcionalidades */}
        <div className="mt-8">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Em breve</h2>
            <p className="text-gray-400">
              Mais funcionalidades estarão disponíveis em breve, incluindo gestão de serviços e reservas.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
