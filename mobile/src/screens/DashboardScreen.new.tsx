import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/auth.store';
import { useNavigation } from '../navigation/NavigationContext';

export function DashboardScreen() {
  const { user, logout } = useAuthStore();
  const { navigate } = useNavigation();

  const handleLogout = async () => {
    await logout();
    navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo!</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{user?.name}</Text>

          <Text style={[styles.label, styles.spacer]}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>

          <Text style={[styles.label, styles.spacer]}>Saldo</Text>
          <Text style={styles.credit}>{user?.credit.toFixed(2)} AOA</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1E2139',
    padding: 24,
    borderRadius: 8,
    marginBottom: 24,
  },
  label: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  spacer: {
    marginTop: 16,
  },
  credit: {
    color: '#00D9BC',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 8,
    marginTop: 'auto',
  },
  logoutText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
