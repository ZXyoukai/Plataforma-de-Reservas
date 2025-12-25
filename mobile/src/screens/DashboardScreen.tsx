import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/auth.store';

export function DashboardScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="flex-1 p-6">
        <Text className="text-3xl font-bold text-white mb-6">
          Bem-vindo!
        </Text>

        <View className="bg-dark-lighter p-6 rounded-lg mb-6">
          <Text className="text-gray-400 text-sm mb-2">Nome</Text>
          <Text className="text-white text-lg font-semibold mb-4">
            {user?.name}
          </Text>

          <Text className="text-gray-400 text-sm mb-2">Email</Text>
          <Text className="text-white text-lg font-semibold mb-4">
            {user?.email}
          </Text>

          <Text className="text-gray-400 text-sm mb-2">Saldo</Text>
          <Text className="text-primary text-2xl font-bold">
            {user?.credit.toFixed(2)} AOA
          </Text>
        </View>

        <TouchableOpacity
          className="bg-red-500 p-4 rounded-lg mt-auto"
          onPress={handleLogout}
        >
          <Text className="text-white text-center font-bold text-lg">
            Sair
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
