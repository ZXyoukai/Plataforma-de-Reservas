import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../navigation/NavigationContext';
import { useReservationStore } from '../store/reservation.store';
import { useAuthStore } from '../store/auth.store';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#F59E0B',
  CONFIRMED: '#3B82F6',
  COMPLETED: '#10B981',
  CANCELLED: '#EF4444',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmada',
  COMPLETED: 'Concluída',
  CANCELLED: 'Cancelada',
};

export function ServiceReservationsScreen() {
  const { goBack } = useNavigation();
  const { user } = useAuthStore();
  const { 
    serviceReservations, 
    isLoading, 
    error, 
    fetchServiceReservations, 
    updateReservationStatus 
  } = useReservationStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      await fetchServiceReservations();
    } catch (err) {
      console.error('Erro ao carregar reservas:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReservations();
    setRefreshing(false);
  };

  const handleConfirm = (reservationId: string) => {
    Alert.alert(
      'Confirmar Reserva',
      'Deseja confirmar esta reserva?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await updateReservationStatus(reservationId, { status: 'CONFIRMED' });
              Alert.alert('Sucesso', 'Reserva confirmada!');
            } catch (err: any) {
              Alert.alert('Erro', err.message || 'Erro ao confirmar reserva');
            }
          },
        },
      ]
    );
  };

  const handleComplete = (reservationId: string) => {
    Alert.alert(
      'Concluir Reserva',
      'Deseja marcar esta reserva como concluída?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Concluir',
          onPress: async () => {
            try {
              await updateReservationStatus(reservationId, { status: 'COMPLETED' });
              Alert.alert('Sucesso', 'Reserva concluída!');
            } catch (err: any) {
              Alert.alert('Erro', err.message || 'Erro ao concluir reserva');
            }
          },
        },
      ]
    );
  };

  const handleCancel = (reservationId: string) => {
    Alert.alert(
      'Cancelar Reserva',
      'Deseja cancelar esta reserva? Esta ação não pode ser desfeita.',
      [
        { text: 'Voltar', style: 'cancel' },
        {
          text: 'Cancelar Reserva',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateReservationStatus(reservationId, { status: 'CANCELLED' });
              Alert.alert('Sucesso', 'Reserva cancelada!');
            } catch (err: any) {
              Alert.alert('Erro', err.message || 'Erro ao cancelar reserva');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Agrupar por serviço
  const groupedReservations = serviceReservations.reduce((acc: any, reservation) => {
    const serviceName = reservation.service?.name || 'Serviço Desconhecido';
    if (!acc[serviceName]) {
      acc[serviceName] = [];
    }
    acc[serviceName].push(reservation);
    return acc;
  }, {});

  // Estatísticas
  const stats = {
    total: serviceReservations.length,
    pending: serviceReservations.filter((r) => r.status === 'PENDING').length,
    confirmed: serviceReservations.filter((r) => r.status === 'CONFIRMED').length,
    completed: serviceReservations.filter((r) => r.status === 'COMPLETED').length,
    totalRevenue: serviceReservations
      .filter((r) => r.status === 'COMPLETED')
      .reduce((sum, r) => sum + (r.amount || 0), 0),
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E2139" />
      <View style={styles.statusBarPadding} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reservas Recebidas</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="calendar" size={24} color="#00D9BC" />
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color="#F59E0B" />
          <Text style={styles.statValue}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          <Text style={styles.statValue}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Concluídas</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cash" size={24} color="#00D9BC" />
          <Text style={styles.statValue}>{stats.totalRevenue.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Receita (AOA)</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00D9BC']} />
        }
      >
        {isLoading && serviceReservations.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.loadingText}>A carregar...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Ionicons name="alert-circle" size={48} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : serviceReservations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Nenhuma Reserva</Text>
            <Text style={styles.emptyText}>
              Você ainda não recebeu nenhuma reserva para seus serviços.
            </Text>
          </View>
        ) : (
          <View style={styles.reservationsList}>
            {Object.keys(groupedReservations).map((serviceName) => (
              <View key={serviceName} style={styles.serviceGroup}>
                <View style={styles.serviceGroupHeader}>
                  <Ionicons name="briefcase" size={20} color="#00D9BC" />
                  <Text style={styles.serviceGroupTitle}>{serviceName}</Text>
                  <View style={styles.serviceGroupBadge}>
                    <Text style={styles.serviceGroupBadgeText}>
                      {groupedReservations[serviceName].length}
                    </Text>
                  </View>
                </View>

                {groupedReservations[serviceName].map((reservation: any) => (
                  <View key={reservation.id} style={styles.reservationCard}>
                    <View style={styles.reservationHeader}>
                      <View style={styles.clientInfo}>
                        <Ionicons name="person-circle" size={40} color="#9CA3AF" />
                        <View style={styles.clientDetails}>
                          <Text style={styles.clientName}>
                            {reservation.user?.name || 'Cliente'}
                          </Text>
                          <Text style={styles.clientEmail}>
                            {reservation.user?.email || 'N/A'}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: STATUS_COLORS[reservation.status] + '20' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: STATUS_COLORS[reservation.status] },
                          ]}
                        >
                          {STATUS_LABELS[reservation.status]}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.reservationDetails}>
                      <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
                        <Text style={styles.detailText}>{formatDate(reservation.createdAt)}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="cash-outline" size={16} color="#9CA3AF" />
                        <Text style={styles.detailText}>{reservation.amount.toFixed(2)} AOA</Text>
                      </View>
                    </View>

                    {reservation.status === 'PENDING' && (
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={[styles.actionBtn, styles.confirmBtn]}
                          onPress={() => handleConfirm(reservation.id)}
                        >
                          <Ionicons name="checkmark" size={18} color="#FFF" />
                          <Text style={styles.actionBtnText}>Confirmar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionBtn, styles.cancelBtn]}
                          onPress={() => handleCancel(reservation.id)}
                        >
                          <Ionicons name="close" size={18} color="#FFF" />
                          <Text style={styles.actionBtnText}>Recusar</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {reservation.status === 'CONFIRMED' && (
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={[styles.actionBtn, styles.completeBtn]}
                          onPress={() => handleComplete(reservation.id)}
                        >
                          <Ionicons name="checkmark-done" size={18} color="#FFF" />
                          <Text style={styles.actionBtnText}>Concluir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionBtn, styles.cancelBtn]}
                          onPress={() => handleCancel(reservation.id)}
                        >
                          <Ionicons name="close" size={18} color="#FFF" />
                          <Text style={styles.actionBtnText}>Cancelar</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  statusBarPadding: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 44,
    backgroundColor: '#1E2139',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1E2139',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E2139',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2F4F',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 60,
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
  reservationsList: {
    padding: 16,
  },
  serviceGroup: {
    marginBottom: 24,
  },
  serviceGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceGroupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
    flex: 1,
  },
  serviceGroupBadge: {
    backgroundColor: '#00D9BC',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  serviceGroupBadgeText: {
    color: '#0A0E27',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reservationCard: {
    backgroundColor: '#1E2139',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2F4F',
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  clientDetails: {
    marginLeft: 12,
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  clientEmail: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reservationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2F4F',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  confirmBtn: {
    backgroundColor: '#3B82F6',
  },
  completeBtn: {
    backgroundColor: '#10B981',
  },
  cancelBtn: {
    backgroundColor: '#EF4444',
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
