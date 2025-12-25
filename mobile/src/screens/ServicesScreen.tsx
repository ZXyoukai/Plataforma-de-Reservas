import React, { useEffect, useState } from 'react';
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
import { useServiceStore } from '../store/service.store';
import { useReservationStore } from '../store/reservation.store';
import { useAuthStore } from '../store/auth.store';
import type { Service } from '../types/service.types';
import { UserRole } from '../types/auth.types';

export function ServicesScreen() {
  const { navigate } = useNavigation();
  const { user } = useAuthStore();
  const { services, isLoading, error, fetchAllServices } = useServiceStore();
  const { createReservation, isLoading: creatingReservation } = useReservationStore();
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    await fetchAllServices();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadServices();
    setRefreshing(false);
  };

  const handleContractService = (service: Service) => {
    if (!user) return;

    // Verificar saldo
    if (user.credit < service.price) {
      Alert.alert(
        'Saldo Insuficiente',
        `Você possui ${user.credit.toFixed(2)} AOA e o serviço custa ${service.price.toFixed(2)} AOA.`
      );
      return;
    }

    // Confirmar contratação
    Alert.alert(
      'Confirmar Contratação',
      `Deseja contratar "${service.name}" por ${service.price.toFixed(2)} AOA?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar',
          onPress: () => confirmContract(service),
        },
      ]
    );
  };

  const confirmContract = async (service: Service) => {
    try {
      const reservationDate = new Date().toISOString();
      
      await createReservation({
        serviceId: service.id,
        date: reservationDate,
      });

      Alert.alert(
        'Sucesso!',
        `Serviço "${service.name}" contratado com sucesso!`,
        [
          {
            text: 'OK',
            onPress: () => navigate('Dashboard'),
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao contratar serviço:', error);
      Alert.alert('Erro', 'Não foi possível contratar o serviço. Tente novamente.');
    }
  };

  const renderService = ({ item }: { item: Service }) => (
    <View style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>{item.price.toFixed(2)} AOA</Text>
      </View>
      
      <Text style={styles.serviceDescription}>{item.description}</Text>
      
      {item.providerName && (
        <Text style={styles.providerName}>Por: {item.providerName}</Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.contractButton,
          (creatingReservation || !user || user.credit < item.price) && styles.contractButtonDisabled,
        ]}
        onPress={() => handleContractService(item)}
        disabled={creatingReservation || !user || user.credit < item.price}
      >
        <Text style={styles.contractButtonText}>
          {creatingReservation ? 'Contratando...' : 'Contratar Serviço'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1E2139" />
        <View style={styles.statusBarPadding} />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigate('Dashboard')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Serviços Disponíveis</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00D9BC" />
          <Text style={styles.loadingText}>Carregando serviços...</Text>
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
        <Text style={styles.headerTitle}>Serviços Disponíveis</Text>
        <View style={styles.placeholder} />
      </View>

      {/* User Balance */}
      {user && (
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Disponível</Text>
          <Text style={styles.balanceValue}>{user.credit.toFixed(2)} AOA</Text>
        </View>
      )}

      {/* Error Message */}
      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Services List */}
      <FlatList
        data={services}
        renderItem={renderService}
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
            <Text style={styles.emptyText}>Nenhum serviço disponível</Text>
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
  balanceCard: {
    backgroundColor: '#1E2139',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 4,
  },
  balanceValue: {
    color: '#00D9BC',
    fontSize: 24,
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
  serviceCard: {
    backgroundColor: '#1E2139',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  servicePrice: {
    color: '#00D9BC',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  serviceDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  providerName: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 12,
  },
  contractButton: {
    backgroundColor: '#00D9BC',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contractButtonDisabled: {
    backgroundColor: '#374151',
  },
  contractButtonText: {
    color: '#0A0E27',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
});
