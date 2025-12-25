import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

export const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(identifier, password);
      navigate('/dashboard');
    } catch (err) {
      // Erro já tratado no store
      console.error('Erro no login:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark via-dark-light to-dark">
      <div className="w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-3xl font-bold">Bulir</span>
          </div>
        </div>

        {/* Card de Login */}
        <div className="card">
          <h1 className="text-2xl font-bold mb-2 text-center">Bem-vindo de volta!</h1>
          <p className="text-gray-400 text-center mb-6">
            Entre com seu e-mail ou NIF para acessar a plataforma
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium mb-2">
                E-mail ou NIF
              </label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="input-field"
                placeholder="Digite seu e-mail ou NIF"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Digite sua senha"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Ainda não tem uma conta?{' '}
              <a href="/register" className="text-primary hover:text-primary-light font-medium">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          © 2024 Bulir. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};
