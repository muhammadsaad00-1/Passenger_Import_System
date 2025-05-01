// src/contexts/ThemeContext.js
import { createContext, useContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: {
          main: mode === 'light' ? '#1976d2' : '#90caf9',
        },
        secondary: {
          main: mode === 'light' ? '#dc004e' : '#f48fb1',
        },
        background: {
          default: mode === 'light' ? '#f5f5f5' : '#121212',
          paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
        },
      },
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);