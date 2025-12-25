import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '../navigation/NavigationContext';
import { useAuthStore } from '../store/auth.store';

export function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { navigate } = useNavigation();
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      await login(identifier, password);
      // Após login bem-sucedido, navega para Dashboard
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
      <View style={styles.content}>
        {/* Logo/Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Bulir</Text>
          <Text style={styles.subtitle}>Plataforma de Reservas</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email ou NIF</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email ou NIF"
              placeholderTextColor="#9CA3AF"
              value={identifier}
              onChangeText={setIdentifier}
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

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
          >
            {isLoading ? (
              <ActivityIndicator color="#0A0E27" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigate('Register')}
          >
            <Text style={styles.registerText}>
              Não tem uma conta?{' '}
              <Text style={styles.registerTextBold}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00D9BC',
    textAlign: 'center',
  },
  subtitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 18,
  },
  form: {},
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#FFFFFF',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#1E2139',
    color: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
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
  registerLink: {
    marginTop: 16,
  },
  registerText: {
    color: '#9CA3AF',
    textAlign: 'center',
  },
  registerTextBold: {
    color: '#00D9BC',
    fontWeight: '600',
  },
});
