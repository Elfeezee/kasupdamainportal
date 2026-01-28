
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<string>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Force light mode on mount
    setTheme('light');
    setMounted(true);
  }, []);

  const setTheme = (newTheme: string) => {
    // Always force light mode
    const forcedTheme = 'light';
    setThemeState(forcedTheme);
    localStorage.setItem('kasupda-theme', forcedTheme);
    document.documentElement.classList.remove('dark');
  };

  const toggleTheme = () => {
    // Do nothing or force light
    setTheme('light');
  };

  const value = { theme: 'light', setTheme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
