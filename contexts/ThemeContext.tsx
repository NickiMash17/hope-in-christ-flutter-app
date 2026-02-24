import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/colors';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  colors: typeof Colors.light;
  gradients: {
    primary: string[];
    accent: string[];
    blue: string[];
    gold: string[];
    hero: string[];
    glass: string[];
  };
  glass: string;
  shadow: {
    light: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    dark: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('light');
  const systemColorScheme = useColorScheme();

  // Load saved theme on mount
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const saveTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    saveTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const isDark = theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const gradients = {
    primary: isDark 
      ? [Colors.primaryDark, Colors.primary, Colors.primaryLight]
      : [Colors.primaryLight, Colors.primary, Colors.primaryDark],
    accent: isDark
      ? [Colors.accent, Colors.accentLight || Colors.accent]
      : [Colors.accentLight || Colors.accent, Colors.accent],
    blue: isDark
      ? [Colors.accentBlueDark, Colors.accentBlue]
      : [Colors.accentBlue, Colors.accentBlueDark],
    gold: isDark
      ? [Colors.goldDark || Colors.gold, Colors.gold]
      : [Colors.goldLight, Colors.gold, Colors.goldDark || Colors.gold],
    hero: isDark
      ? [Colors.primary, Colors.accent, Colors.accentBlue, Colors.dark.background]
      : [Colors.primaryLight, Colors.accent, Colors.accentBlue, Colors.light.background],
    glass: isDark
      ? ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']
      : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)'],
  };

  const glass = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)';

  const shadow = {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    dark: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
  };

  const value: ThemeContextType = {
    theme,
    isDark,
    colors,
    gradients,
    glass,
    shadow,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
