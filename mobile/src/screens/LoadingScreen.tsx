import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export function LoadingScreen() {
  return (
    <View className="flex-1 bg-dark items-center justify-center">
      <ActivityIndicator size="large" color="#00D9BC" />
      <Text className="text-white mt-4 text-lg">Carregando...</Text>
    </View>
  );
}
