import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useAuthStore } from '../store/auth.store';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      await login(identifier, password);
    } catch (err) {
      // Erro já está no store
    }
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('Erro', error);
      clearError();
    }
  }, [error]);

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6">
            {/* Logo/Title */}
            <View className="mb-10">
              <Text className="text-5xl font-bold text-primary text-center">
                Bulir
              </Text>
              <Text className="text-white text-center mt-2 text-lg">
                Plataforma de Reservas
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              <View>
                <Text className="text-white mb-2 text-base">
                  Email ou NIF
                </Text>
                <TextInput
                  className="bg-dark-lighter text-white p-4 rounded-lg text-base"
                  placeholder="Digite seu email ou NIF"
                  placeholderTextColor="#9CA3AF"
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View>
                <Text className="text-white mb-2 text-base">Senha</Text>
                <TextInput
                  className="bg-dark-lighter text-white p-4 rounded-lg text-base"
                  placeholder="Digite sua senha"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                className="bg-primary p-4 rounded-lg mt-6"
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#0A0E27" />
                ) : (
                  <Text className="text-dark text-center font-bold text-lg">
                    Entrar
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="mt-4"
                onPress={() => navigation.navigate('Register')}
              >
                <Text className="text-gray-400 text-center">
                  Não tem uma conta?{' '}
                  <Text className="text-primary font-semibold">
                    Cadastre-se
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
