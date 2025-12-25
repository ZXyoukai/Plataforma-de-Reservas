import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservationStore } from '../store/reservation.store';
import { useAuthStore } from '../store/auth.store';
import type { Reservation } from '../types/reservation.types';
import { UserRole } from '../types/auth.types';

export const TransactionsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    reservations, 
    isLoading, 
    error, 
    fetchMyReservations, 
    fetchServiceReservations 
  } = useReservationStore();
  
  const [filter, setFilter] = useState<'all' | 'debit' | 'credit'>('all');

  // Carregar reservas ao montar
  useEffect(() => {
    if (!user) return;
    
    const isClient = user.role === UserRole.CLIENT || user.role === 'CLIENT';
    const isProvider = user.role === UserRole.SERVICE_PROVIDER || user.role === 'SERVICE_PROVIDER';
    
    if (isClient) {
      fetchMyReservations(); // Clientes veem suas contratações (débitos)
    } else if (isProvider) {
      fetchServiceReservations(); // Prestadores veem receitas (créditos)
    }
  }, [user, fetchMyReservations, fetchServiceReservations]);

  const isClientRole = () => {
    return user?.role === UserRole.CLIENT || user?.role === 'CLIENT';
  };

  const getTransactionType = (): 'DEBIT' | 'CREDIT' => {
    return isClientRole() ? 'DEBIT' : 'CREDIT';
  };

  const getRelatedUserName = (reservation: Reservation): string => {
    if (isClientRole()) {
      return reservation.providerName || 'Prestador';
    }
    return reservation.clientName || 'Cliente';
  };

  const getRelatedUserLabel = (): string => {
    return isClientRole() ? 'Prestador' : 'Cliente';
  };

  const filteredReservations = reservations.filter(() => {
    if (filter === 'all') return true;
    const type = getTransactionType();
    return filter === type.toLowerCase();
  });

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; text: string }> = {
      PENDING: { color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500', text: 'Pendente' },
      CONFIRMED: { color: 'bg-blue-500/10 text-blue-500 border-blue-500', text: 'Confirmado' },
      COMPLETED: { color: 'bg-green-500/10 text-green-500 border-green-500', text: 'Concluído' },
      CANCELLED: { color: 'bg-red-500/10 text-red-500 border-red-500', text: 'Cancelado' },
    };
    
    const badge = badges[status] || badges.PENDING;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotalAmount = () => {
    if (!filteredReservations || filteredReservations.length === 0) return 0;
    return filteredReservations.reduce((sum, reservation) => {
      return sum + (reservation.servicePrice || 0);
    }, 0);
  };

  // Verifica se o usuário está carregado
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-400">Carregando transações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark">
      {/* Header */}
      <header className="bg-dark-light border-b border-dark-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold">Histórico de Transações</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros e Resumo */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Card Total */}
          <div className="card">
            <h3 className="text-sm text-gray-400 mb-2">Total Transacionado</h3>
            <p className="text-2xl font-bold text-primary">
              {calculateTotalAmount().toFixed(2)} AOA
            </p>
          </div>

          {/* Card Quantidade */}
          <div className="card">
            <h3 className="text-sm text-gray-400 mb-2">Total de Transações</h3>
            <p className="text-2xl font-bold">{filteredReservations.length}</p>
          </div>

          {/* Filtros */}
          <div className="card lg:col-span-2">
            <h3 className="text-sm text-gray-400 mb-3">Filtrar por tipo</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-primary text-dark'
                    : 'bg-dark-lighter text-gray-400 hover:bg-dark-lighter/80'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('debit')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  filter === 'debit'
                    ? 'bg-red-500 text-white'
                    : 'bg-dark-lighter text-gray-400 hover:bg-dark-lighter/80'
                }`}
              >
                Débitos
              </button>
              <button
                onClick={() => setFilter('credit')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  filter === 'credit'
                    ? 'bg-green-500 text-white'
                    : 'bg-dark-lighter text-gray-400 hover:bg-dark-lighter/80'
                }`}
              >
                Créditos
              </button>
            </div>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Lista de Transações */}
        {filteredReservations.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold mb-2 text-gray-400">Nenhuma transação encontrada</h3>
            <p className="text-gray-500">Você ainda não possui transações registradas.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            {/* Header da Tabela */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-lighter">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Serviço
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {getRelatedUserLabel()}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-lighter">
                  {filteredReservations.map((reservation) => {
                    const type = getTransactionType();
                    return (
                      <tr key={reservation.id} className="hover:bg-dark-lighter/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {reservation.createdAt ? formatDate(reservation.createdAt) : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          {reservation.serviceName || 'Serviço não identificado'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          {getRelatedUserName(reservation)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            type === 'DEBIT' 
                              ? 'bg-red-500/10 text-red-500' 
                              : 'bg-green-500/10 text-green-500'
                          }`}>
                            {type === 'DEBIT' ? '↓ Débito' : '↑ Crédito'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                          <span className={type === 'DEBIT' ? 'text-red-500' : 'text-green-500'}>
                            {type === 'DEBIT' ? '-' : '+'} {(reservation.servicePrice || 0).toFixed(2)} AOA
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(reservation.status || 'PENDING')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
