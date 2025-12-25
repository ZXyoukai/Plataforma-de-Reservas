import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/auth.store';
import { useNavigation } from '../navigation/NavigationContext';
import { UserRole } from '../types/auth.types';

export function DashboardScreen() {
  const { user, logout } = useAuthStore();
  const { navigate } = useNavigation();

  const handleLogout = async () => {
    await logout();
    navigate('Login');
  };

  const isClient = user?.role === UserRole.CLIENT;
  const isProvider = user?.role === UserRole.SERVICE_PROVIDER;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E2139" />
      <View style={styles.statusBarPadding} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Ionicons name="clipboard-outline" size={20} color="#0A0E27" />
          </View>
          <Text style={styles.headerTitle}>Bulir</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>{user?.name}</Text>
            <Text style={styles.userRole}>
              {isProvider ? 'Prestador' : 'Cliente'}
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>
              Bem-vindo à nossa Plataforma de Reservas, {user?.name}!
            </Text>
          </View>

          {/* Info Cards Grid */}
          <View style={styles.cardsGrid}>
            {/* Saldo Card */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>Saldo Disponível</Text>
                <Ionicons name="cash-outline" size={28} color="#00D9BC" />
              </View>
              <Text style={styles.cardValuePrimary}>{user?.credit.toFixed(2)} AOA</Text>
            </View>

            {/* Email Card */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>E-mail</Text>
                <Ionicons name="mail-outline" size={28} color="#00D9BC" />
              </View>
              <Text style={styles.cardValue} numberOfLines={1}>{user?.email}</Text>
            </View>

            {/* NIF Card */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardLabel}>NIF</Text>
                <Ionicons name="card-outline" size={28} color="#00D9BC" />
              </View>
              <Text style={styles.cardValue}>{user?.nif}</Text>
            </View>
          </View>

          {/* Actions Section */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Ações Rápidas</Text>
            
            <View style={styles.actionsGrid}>
              {isProvider ? (
                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => navigate('MyServices')}
                >
                  <View style={styles.actionIconContainer}>
                    <Ionicons name="briefcase-outline" size={24} color="#00D9BC" />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>Gerenciar Serviços</Text>
                    <Text style={styles.actionSubtitle}>Crie e edite seus serviços</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => navigate('Services')}
                >
                  <View style={styles.actionIconContainer}>
                    <Ionicons name="search-outline" size={24} color="#00D9BC" />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>Contratar Serviços</Text>
                    <Text style={styles.actionSubtitle}>Explore e contrate serviços</Text>
                  </View>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => navigate('Transactions')}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons name="bar-chart-outline" size={24} color="#00D9BC" />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionTitle}>Histórico</Text>
                  <Text style={styles.actionSubtitle}>Veja todas as suas transações</Text>
                </View>
              </TouchableOpacity>

              {isProvider ? (
                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => navigate('ServiceReservations')}
                >
                  <View style={styles.actionIconContainer}>
                    <Ionicons name="calendar-outline" size={24} color="#00D9BC" />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>Reservas Recebidas</Text>
                    <Text style={styles.actionSubtitle}>Gerencie as reservas</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => navigate('MyReservations')}
                >
                  <View style={styles.actionIconContainer}>
                    <Ionicons name="list-outline" size={24} color="#00D9BC" />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>Minhas Reservas</Text>
                    <Text style={styles.actionSubtitle}>Veja seus serviços contratados</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
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
    backgroundColor: '#1E2139',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2F4F',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#00D9BC',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'flex-end',
  },
  userInfo: {
    alignItems: 'flex-end',
    maxWidth: 150,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  userRole: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#00D9BC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: {
    color: '#00D9BC',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  welcomeSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  cardsGrid: {
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#1E2139',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2F4F',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  cardValuePrimary: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00D9BC',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  actionsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#1E2139',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2F4F',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(0, 217, 188, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
