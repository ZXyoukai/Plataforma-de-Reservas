import React, { createContext, useContext, useState, ReactNode } from 'react';

type Screen = 'Login' | 'Register' | 'Dashboard';

interface NavigationContextType {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Login');
  const [history, setHistory] = useState<Screen[]>(['Login']);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
    setHistory(prev => [...prev, screen]);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentScreen(newHistory[newHistory.length - 1]);
    }
  };

  return (
    <NavigationContext.Provider value={{ currentScreen, navigate, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
