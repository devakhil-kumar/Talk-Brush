import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import AuthNavigator from './src/navigation/AuthNavigator';
import { ThemeProvider } from './src/contexts/ThemeProvider';

const App = () => {
  return (
    <NavigationContainer>
      <ThemeProvider>
        <AuthNavigator />
      </ThemeProvider>
    </NavigationContainer>
  );
};

export default App;