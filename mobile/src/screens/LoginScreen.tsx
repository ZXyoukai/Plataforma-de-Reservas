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
  StyleSheet,
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
        >
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
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.registerText}>
                  Não tem uma conta?{' '}
                  <Text style={styles.registerTextBold}>Cadastre-se</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  form: {
    // gap não é suportado em todas versões
  },
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
