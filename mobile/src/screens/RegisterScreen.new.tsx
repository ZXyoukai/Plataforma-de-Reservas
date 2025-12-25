import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '../navigation/NavigationContext';
import { useAuthStore } from '../store/auth.store';
import { UserRole } from '../types/auth.types';

export function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nif, setNif] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
  const { navigate, goBack } = useNavigation();
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleRegister = async () => {
    if (!email || !password || !name || !nif) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      await register({ email, password, name, nif, role });
      // Após registro, será redirecionado automaticamente pelo login
      navigate('Dashboard');
    } catch (err) {
      // Erro já está no store
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Erro', error);
      clearError();
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>
            Preencha os dados para se cadastrar
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>NIF</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu NIF"
                placeholderTextColor="#9CA3AF"
                value={nif}
                onChangeText={setNif}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tipo de Conta</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={role}
                  onValueChange={(itemValue: UserRole) => setRole(itemValue)}
                  style={styles.picker}
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
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
            >
              {isLoading ? (
                <ActivityIndicator color="#0A0E27" />
              ) : (
                <Text style={styles.buttonText}>Cadastrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => goBack()}
            >
              <Text style={styles.loginText}>
                Já tem uma conta?{' '}
                <Text style={styles.loginTextBold}>Entrar</Text>
              </Text>
            </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00D9BC',
    marginBottom: 8,
  },
  subtitle: {
    color: '#9CA3AF',
    marginBottom: 32,
  },
  form: {},
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1E2139',
    color: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
  },
  pickerContainer: {
    backgroundColor: '#1E2139',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#00D9BC',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#0A0E27',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginLink: {
    marginTop: 16,
  },
  loginText: {
    color: '#9CA3AF',
    textAlign: 'center',
  },
  loginTextBold: {
    color: '#00D9BC',
    fontWeight: '600',
  },
});
