import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '../navigation/NavigationContext';
import { useReservationStore } from '../store/reservation.store';
import { useAuthStore } from '../store/auth.store';
import { UserRole } from '../types/auth.types';
import type { Reservation } from '../types/reservation.types';

export function TransactionsScreen() {
  const { navigate } = useNavigation();
  const { user } = useAuthStore();
  const { 
    reservations, 
    isLoading, 
    error, 
    fetchMyReservations, 
    fetchServiceReservations 
  } = useReservationStore();

  const [refreshing, setRefreshing] = React.useState(false);

  const isClient = user?.role === UserRole.CLIENT;

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    if (isClient) {
      await fetchMyReservations();
    } else {
      await fetchServiceReservations();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
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

  const calculateTotal = () => {
    return reservations.reduce((sum, r) => sum + (r.amount || r.servicePrice || 0), 0);
  };

  const renderTransaction = ({ item }: { item: Reservation }) => {
    const amount = item.amount || item.servicePrice || 0;
    const relatedUser = isClient ? item.providerName : item.clientName;

    return (
      <View style={styles.transactionCard}>
        <View style={styles.transactionHeader}>
          <View style={styles.transactionInfo}>
            <Text style={styles.serviceName}>{item.serviceName}</Text>
            <Text style={styles.relatedUser}>
              {isClient ? 'Prestador' : 'Cliente'}: {relatedUser || 'N/A'}
            </Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={[styles.amount, { color: isClient ? '#EF4444' : '#10B981' }]}>
              {isClient ? '-' : '+'} {amount.toFixed(2)} AOA
            </Text>
          </View>
        </View>

        <View style={styles.transactionFooter}>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
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
          <Text style={styles.headerTitle}>Histórico de Transações</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00D9BC" />
          <Text style={styles.loadingText}>Carregando transações...</Text>
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
        <Text style={styles.headerTitle}>Histórico</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Total Card */}
      <View style={styles.totalCard}>
        <View style={styles.totalInfo}>
          <Text style={styles.totalLabel}>
            {isClient ? 'Total Gasto' : 'Total Recebido'}
          </Text>
          <Text style={[styles.totalValue, { color: isClient ? '#EF4444' : '#10B981' }]}>
            {calculateTotal().toFixed(2)} AOA
          </Text>
        </View>
        <Ionicons 
          name={isClient ? "arrow-down-circle" : "arrow-up-circle"} 
          size={48} 
          color={isClient ? '#EF4444' : '#10B981'} 
        />
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Transactions List */}
      <FlatList
        data={reservations}
        renderItem={renderTransaction}
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
            <Ionicons name="receipt-outline" size={64} color="#374151" />
            <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
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
  totalCard: {
    backgroundColor: '#1E2139',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2F4F',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalInfo: {
    flex: 1,
  },
  totalLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  errorCard: {
    backgroundColor: '#EF4444',
    marginHorizontal: 16,
    marginBottom: 16,
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
  transactionCard: {
    backgroundColor: '#1E2139',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2F4F',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  serviceName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  relatedUser: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionFooter: {
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
  date: {
    color: '#6B7280',
    fontSize: 12,
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
  },
});
