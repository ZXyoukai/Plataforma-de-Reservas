import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../navigation/NavigationContext';
import { useReservationStore } from '../store/reservation.store';
import type { Reservation } from '../types/reservation.types';

export function MyReservationsScreen() {
  const { navigate } = useNavigation();
  const { 
    reservations, 
    isLoading, 
    error, 
    fetchMyReservations,
    cancelReservation,
  } = useReservationStore();

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    await fetchMyReservations();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReservations();
    setRefreshing(false);
  };

  const handleCancelReservation = (reservation: Reservation) => {
    if (reservation.status === 'CANCELLED' || reservation.status === 'COMPLETED') {
      Alert.alert('Atenção', 'Esta reserva não pode ser cancelada.');
      return;
    }

    Alert.alert(
      'Cancelar Reserva',
      `Deseja cancelar a reserva de "${reservation.serviceName}"?`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelReservation(reservation.id);
              Alert.alert('Sucesso', 'Reserva cancelada com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível cancelar a reserva.');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: '#F59E0B',
      CONFIRMED: '#3B82F6',
      COMPLETED: '#10B981',
      CANCELLED: '#EF4444',
    };
    return colors[status] || '#9CA3AF';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      PENDING: 'Pendente',
      CONFIRMED: 'Confirmado',
      COMPLETED: 'Concluído',
      CANCELLED: 'Cancelado',
    };
    return texts[status] || status;
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

  const renderReservation = ({ item }: { item: Reservation }) => {
    const amount = item.amount || item.servicePrice || 0;
    const canCancel = item.status !== 'CANCELLED' && item.status !== 'COMPLETED';

    return (
      <View style={styles.reservationCard}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="calendar" size={24} color="#00D9BC" />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.serviceName}>{item.serviceName}</Text>
            <Text style={styles.providerName}>
              Prestador: {item.providerName || 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Valor</Text>
            <Text style={styles.detailValue}>{amount.toFixed(2)} AOA</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Data</Text>
            <Text style={styles.detailValue}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusText(item.status)}
            </Text>
          </View>

          {canCancel && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelReservation(item)}
            >
              <Ionicons name="close-circle" size={20} color="#EF4444" />
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1E2139" />
        <View style={styles.statusBarPadding} />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigate('Dashboard')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Minhas Reservas</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00D9BC" />
          <Text style={styles.loadingText}>Carregando reservas...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E2139" />
      <View style={styles.statusBarPadding} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate('Dashboard')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minhas Reservas</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Reservations List */}
      <FlatList
        data={reservations}
        renderItem={renderReservation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00D9BC']}
            tintColor="#00D9BC"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={64} color="#374151" />
            <Text style={styles.emptyText}>Nenhuma reserva encontrada</Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => navigate('Services')}
            >
              <Text style={styles.browseButtonText}>Explorar Serviços</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1E2139',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2F4F',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  errorCard: {
    backgroundColor: '#EF4444',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 16,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  reservationCard: {
    backgroundColor: '#1E2139',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2F4F',
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(0, 217, 188, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  serviceName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  providerName: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#00D9BC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#0A0E27',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
