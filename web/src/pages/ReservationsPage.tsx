import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservationStore } from '../store/reservation.store';
import { useAuthStore } from '../store/auth.store';
import { reservationService } from '../services/reservation.service';
import type { Reservation } from '../types/reservation.types';
import { ReservationStatus } from '../types/reservation.types';
import { UserRole } from '../types/auth.types';

export const ReservationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    reservations, 
    isLoading, 
    error, 
    fetchMyReservations, 
    fetchServiceReservations,
    cancelReservation 
  } = useReservationStore();
  
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');

  const isProvider = user?.role === UserRole.SERVICE_PROVIDER || user?.role === 'SERVICE_PROVIDER';

  useEffect(() => {
    if (!user) return;
    
    if (isProvider) {
      fetchServiceReservations();
    } else {
      fetchMyReservations();
    }
  }, [user, isProvider, fetchMyReservations, fetchServiceReservations]);

  const handleStatusChange = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setNewStatus(reservation.status);
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedReservation) return;

    setUpdatingStatus(true);
    try {
      await reservationService.updateStatus(selectedReservation.id, { status: newStatus as any });
      
      // Recarregar reservas
      if (isProvider) {
        await fetchServiceReservations();
      } else {
        await fetchMyReservations();
      }
      
      setShowStatusModal(false);
      setSelectedReservation(null);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCancelReservation = async (reservation: Reservation) => {
    if (!confirm(`Tem certeza que deseja cancelar a reserva do serviço "${reservation.serviceName}"?\n\nO valor será reembolsado.`)) {
      return;
    }

    try {
      await cancelReservation(reservation.id);
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
    }
  };

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

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-400">Carregando reservas...</p>
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
              <h1 className="text-xl font-bold">
                {isProvider ? 'Reservas dos Meus Serviços' : 'Minhas Reservas'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {reservations.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold mb-2 text-gray-400">Nenhuma reserva encontrada</h3>
            <p className="text-gray-500">
              {isProvider 
                ? 'Ainda não há reservas para seus serviços.' 
                : 'Você ainda não fez nenhuma reserva.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">{reservation.serviceName}</h3>
                  {getStatusBadge(reservation.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-400">
                    <strong>{isProvider ? 'Cliente:' : 'Prestador:'}</strong>{' '}
                    {isProvider ? reservation.clientName : reservation.providerName}
                  </p>
                  <p className="text-sm text-gray-400">
                    <strong>Data:</strong> {formatDate(reservation.createdAt)}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {reservation.servicePrice.toFixed(2)} AOA
                  </p>
                </div>

                <div className="flex gap-2">
                  {isProvider && reservation.status !== ReservationStatus.CANCELLED && (
                    <button
                      onClick={() => handleStatusChange(reservation)}
                      className="btn-primary flex-1 text-sm py-2"
                    >
                      Alterar Status
                    </button>
                  )}
                  
                  {!isProvider && reservation.status === ReservationStatus.PENDING && (
                    <button
                      onClick={() => handleCancelReservation(reservation)}
                      className="btn-outline flex-1 text-sm py-2 border-red-500 text-red-500 hover:bg-red-500"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Alteração de Status */}
      {showStatusModal && selectedReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full animate-scale-in">
            <h3 className="text-xl font-bold mb-4">Alterar Status da Reserva</h3>
            
            <div className="space-y-3 mb-6">
              <p><strong>Serviço:</strong> {selectedReservation.serviceName}</p>
              <p><strong>Cliente:</strong> {selectedReservation.clientName}</p>
              <p><strong>Valor:</strong> {selectedReservation.servicePrice.toFixed(2)} AOA</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Novo Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="input-field"
                disabled={updatingStatus}
              >
                <option value={ReservationStatus.PENDING}>Pendente</option>
                <option value={ReservationStatus.CONFIRMED}>Confirmado</option>
                <option value={ReservationStatus.COMPLETED}>Concluído</option>
                <option value={ReservationStatus.CANCELLED}>Cancelado</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedReservation(null);
                }}
                className="btn-outline flex-1"
                disabled={updatingStatus}
              >
                Cancelar
              </button>
              <button
                onClick={confirmStatusChange}
                className="btn-primary flex-1"
                disabled={updatingStatus}
              >
                {updatingStatus ? 'Atualizando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
