import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import { darkTheme, lightTheme } from '../styles/Color'; 

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme === 'dark' ? darkTheme : lightTheme);

  useEffect(() => {
    setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
  }, [colorScheme]);

  const toggleTheme = () => {
    setTheme(theme.mode === 'light' ? darkTheme : lightTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StatusBar
        barStyle={theme.mode === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={theme.background}
      />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);