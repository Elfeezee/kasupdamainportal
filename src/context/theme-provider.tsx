
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
    // This effect runs only on the client
    const storedTheme = localStorage.getItem('kasupda-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let currentTheme = 'light';
    if (storedTheme) {
      currentTheme = storedTheme;
    } else if (systemPrefersDark) {
      currentTheme = 'dark';
    }

    setTheme(currentTheme);
    setMounted(true);
  }, []);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem('kasupda-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };
  
  const value = { theme, setTheme, toggleTheme };

  // To prevent hydration mismatch, we can return null or a placeholder on the server/first render
  if (!mounted) {
    // You can optionally render a skeleton or nothing here
    // Returning children directly but wrapped in provider with default value might be one way,
    // but better to avoid rendering theme-dependent UI until mounted.
    return (
       <ThemeContext.Provider value={value}>
        {/* Render children, but they won't have the correct theme on initial server render. 
            The `suppressHydrationWarning` on <html> tag is key. */}
        {children}
       </ThemeContext.Provider>
    );
  }

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
