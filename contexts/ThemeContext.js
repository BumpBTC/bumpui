import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [walletTheme, setWalletTheme] = useState('bitcoin');
  
    const toggleTheme = () => {
      setIsDarkMode(!isDarkMode);
    };
  
    const getColors = () => {
      const baseColors = isDarkMode
        ? {
            background: '#121212',
            text: '#ffffff',
            error: '#cf6679',
          }
        : {
            background: '#ffffff',
            text: '#121212',
            error: '#B00020',
          };
  
      switch (walletTheme) {
        case 'bitcoin':
          return {
            ...baseColors,
            primary: isDarkMode ? '#F7931A' : '#FF9900',
            secondary: isDarkMode ? '#4D3319' : '#FFE0B2',
            accent: isDarkMode ? '#FFC107' : '#FFA000',
          };
        case 'lightning':
          return {
            ...baseColors,
            primary: isDarkMode ? '#9146FF' : '#7B1FA2',
            secondary: isDarkMode ? '#3F1DCB' : '#E1BEE7',
            accent: isDarkMode ? '#651FFF' : '#6200EA',
          };
        case 'litecoin':
          return {
            ...baseColors,
            primary: isDarkMode ? '#345D9D' : '#0077FF',
            secondary: isDarkMode ? '#1A3C6E' : '#BBDEFB',
            accent: isDarkMode ? '#0288D1' : '#0277BD',
          };
        default:
          return baseColors;
      }
    };
  
    const theme = {
      isDarkMode,
      toggleTheme,
      setWalletTheme,
      colors: getColors(),
    };
  
    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
  };

export default ThemeContext;