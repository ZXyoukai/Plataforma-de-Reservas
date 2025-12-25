import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServiceStore } from '../store/service.store';
import { useReservationStore } from '../store/reservation.store';
import { useAuthStore } from '../store/auth.store';
import { authService } from '../services/auth.service';
import type { Service } from '../types/service.types';
import { UserRole } from '../types/auth.types';

export const BrowseServicesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { services, isLoading: loadingServices, error: servicesError, fetchAllServices } = useServiceStore();
  const { createReservation, isLoading: creatingReservation, error: reservationError, clearError } = useReservationStore();
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Redirecionar se não for cliente
  useEffect(() => {
    if (user && user.role !== UserRole.CLIENT) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Carregar serviços ao montar
  useEffect(() => {
    fetchAllServices();
  }, [fetchAllServices]);

  // Auto-limpar mensagens após 5 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (reservationError) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [reservationError, clearError]);

  const handleContractService = (service: Service) => {
    setSelectedService(service);
    setShowConfirmModal(true);
  };

  const confirmContract = async () => {
    if (!selectedService || !user) return;

    // Verificar saldo
    if (user.credit < selectedService.price) {
      alert(`Saldo insuficiente! Você possui ${user.credit.toFixed(2)} AOA e o serviço custa ${selectedService.price.toFixed(2)} AOA.`);
      setShowConfirmModal(false);
      return;
    }

    try {
      // Gera data atual em formato ISO 8601
      const reservationDate = new Date().toISOString();
      
      await createReservation({ 
        serviceId: selectedService.id,
        date: reservationDate 
      });
      setSuccessMessage(`Serviço "${selectedService.name}" contratado com sucesso!`);
      setShowConfirmModal(false);
      setSelectedService(null);
      
      // Recarregar perfil do usuário para atualizar o saldo
      // sem perder a autenticação
      try {
        const updatedUser = await authService.getProfile();
        
        // Atualizar no localStorage e no store
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Navega para o dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (profileError) {
        console.error('Erro ao atualizar perfil:', profileError);
        // Se falhar, apenas navega para o dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao contratar serviço:', error);
      setShowConfirmModal(false);
    }
  };

  const cancelContract = () => {
    setShowConfirmModal(false);
    setSelectedService(null);
    clearError();
  };

  if (loadingServices) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-dark flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-400">Carregando serviços...</p>
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
              <h1 className="text-xl font-bold">Contratar Serviços</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">Saldo: {user?.credit.toFixed(2)} AOA</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensagens */}
        {successMessage && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-6 animate-shake">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {reservationError && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6 animate-shake">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{reservationError}</span>
            </div>
          </div>
        )}

        {servicesError && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            <p>{servicesError}</p>
          </div>
        )}

        {/* Lista de Serviços */}
        {services.length === 0 ? (
          <div className="card text-center py-12">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold mb-2 text-gray-400">Nenhum serviço disponível</h3>
            <p className="text-gray-500">Ainda não há serviços cadastrados na plataforma.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="card hover:border-primary transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{service.name}</h3>
                  <span className="text-2xl font-bold text-primary">
                    {service.price.toFixed(2)} AOA
                  </span>
                </div>
                
                <p className="text-gray-400 mb-4 line-clamp-3">{service.description}</p>
                
                {service.providerName && (
                  <p className="text-sm text-gray-500 mb-4">
                    Prestador: <span className="text-primary">{service.providerName}</span>
                  </p>
                )}
                
                <button
                  onClick={() => handleContractService(service)}
                  className="btn-primary w-full"
                  disabled={creatingReservation || (user?.credit ?? 0) < service.price}
                >
                  {(user?.credit ?? 0) < service.price ? (
                    'Saldo Insuficiente'
                  ) : creatingReservation ? (
                    'Processando...'
                  ) : (
                    'Contratar Serviço'
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Confirmação */}
      {showConfirmModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full animate-scale-in">
            <h3 className="text-xl font-bold mb-4">Confirmar Contratação</h3>
            
            <div className="space-y-3 mb-6">
              <p><strong>Serviço:</strong> {selectedService.name}</p>
              <p><strong>Valor:</strong> {selectedService.price.toFixed(2)} AOA</p>
              <p><strong>Seu saldo atual:</strong> {user?.credit.toFixed(2)} AOA</p>
              <p><strong>Saldo após contratação:</strong> {((user?.credit ?? 0) - selectedService.price).toFixed(2)} AOA</p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 px-4 py-3 rounded-lg mb-6">
              <p className="text-sm">
                <strong>Atenção:</strong> O valor será debitado do seu saldo imediatamente.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={cancelContract}
                className="btn-outline flex-1"
                disabled={creatingReservation}
              >
                Cancelar
              </button>
              <button
                onClick={confirmContract}
                className="btn-primary flex-1"
                disabled={creatingReservation}
              >
                {creatingReservation ? 'Processando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
