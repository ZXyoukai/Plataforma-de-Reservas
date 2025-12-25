import React, { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { NavigationProvider, useNavigation } from './NavigationContext';

// Screens
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { MyReservationsScreen } from '../screens/MyReservationsScreen';
import { MyServicesScreen } from '../screens/MyServicesScreen';
import { ServiceReservationsScreen } from '../screens/ServiceReservationsScreen';
import { LoadingScreen } from '../screens/LoadingScreen';

function NavigationScreens() {
  const { currentScreen } = useNavigation();
  const { isAuthenticated, hasCheckedStorage, loadUserFromStorage } = useAuthStore();

  useEffect(() => {
    console.log('Navigation montado, carregando storage...');
    loadUserFromStorage().catch(err => {
      console.error('Erro ao carregar storage:', err);
    });
  }, []);

  console.log('hasCheckedStorage:', hasCheckedStorage);
  console.log('isAuthenticated:', isAuthenticated);

  if (!hasCheckedStorage) {
    console.log('Mostrando loading...');
    return <LoadingScreen />;
  }

  console.log('Mostrando tela:', currentScreen);

  // Renderiza a tela atual baseado no estado
  switch (currentScreen) {
    case 'Login':
      return <LoginScreen />;
    case 'Register':
      return <RegisterScreen />;
    case 'Dashboard':
      return <DashboardScreen />;
    case 'Services':
      return <ServicesScreen />;
    case 'Transactions':
      return <TransactionsScreen />;
    case 'MyReservations':
      return <MyReservationsScreen />;
    case 'MyServices':
      return <MyServicesScreen />;
    case 'ServiceReservations':
      return <ServiceReservationsScreen />;
    default:
      return <LoginScreen />;
  }
}

export default function Navigation() {
  return (
    <NavigationProvider>
      <NavigationScreens />
    </NavigationProvider>
  );
}
