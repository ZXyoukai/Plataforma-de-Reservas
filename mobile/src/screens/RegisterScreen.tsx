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
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useAuthStore } from '../store/auth.store';
import { UserRole } from '../types/auth.types';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nif, setNif] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleRegister = async () => {
    if (!email || !password || !name || !nif) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      await register({ email, password, name, nif, role });
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
          <View className="flex-1 justify-center px-6 py-8">
            <Text className="text-4xl font-bold text-primary mb-2">
              Criar Conta
            </Text>
            <Text className="text-gray-400 mb-8">
              Preencha os dados para se cadastrar
            </Text>

            <View className="space-y-4">
              <View>
                <Text className="text-white mb-2">Nome Completo</Text>
                <TextInput
                  className="bg-dark-lighter text-white p-4 rounded-lg"
                  placeholder="Digite seu nome"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View>
                <Text className="text-white mb-2">Email</Text>
                <TextInput
                  className="bg-dark-lighter text-white p-4 rounded-lg"
                  placeholder="Digite seu email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View>
                <Text className="text-white mb-2">NIF</Text>
                <TextInput
                  className="bg-dark-lighter text-white p-4 rounded-lg"
                  placeholder="Digite seu NIF"
                  placeholderTextColor="#9CA3AF"
                  value={nif}
                  onChangeText={setNif}
                  keyboardType="numeric"
                />
              </View>

              <View>
                <Text className="text-white mb-2">Senha</Text>
                <TextInput
                  className="bg-dark-lighter text-white p-4 rounded-lg"
                  placeholder="Digite sua senha"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View>
                <Text className="text-white mb-2">Tipo de Conta</Text>
                <View className="bg-dark-lighter rounded-lg">
                  <Picker
                    selectedValue={role}
                    onValueChange={(itemValue) => setRole(itemValue)}
                    style={{ color: 'white' }}
                  >
                    <Picker.Item label="Cliente" value={UserRole.CLIENT} />
                    <Picker.Item
                      label="Prestador de Serviços"
                      value={UserRole.SERVICE_PROVIDER}
                    />
                  </Picker>
                </View>
              </View>

              <TouchableOpacity
                className="bg-primary p-4 rounded-lg mt-6"
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#0A0E27" />
                ) : (
                  <Text className="text-dark text-center font-bold text-lg">
                    Cadastrar
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="mt-4"
                onPress={() => navigation.goBack()}
              >
                <Text className="text-gray-400 text-center">
                  Já tem uma conta?{' '}
                  <Text className="text-primary font-semibold">Entrar</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
