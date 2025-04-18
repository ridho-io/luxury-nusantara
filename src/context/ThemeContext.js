// src/context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: {},
});

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const lightTheme = {
    background: '#F2F2F7',
    card: 'rgba(255, 255, 255, 0.8)',
    text: '#000000',
    border: '#E5E5EA',
    notification: '#FF3B30',
    primary: '#007AFF',
    secondary: '#5856D6',
    tertiary: '#FF2D55',
    success: '#34C759',
    warning: '#FFCC00',
    error: '#FF3B30',
    gray: '#8E8E93',
  };

  const darkTheme = {
    background: '#1C1C1E',
    card: 'rgba(44, 44, 46, 0.8)',
    text: '#FFFFFF',
    border: '#38383A',
    notification: '#FF453A',
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    tertiary: '#FF375F',
    success: '#30D158',
    warning: '#FFD60A',
    error: '#FF453A',
    gray: '#8E8E93',
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);