import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ThemeProvider } from './src/contexts/ThemeProvider';
import RootNavigator from './src/navigation/RootNavigator';
import store from './src/app/store'
import { Provider } from 'react-redux';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <ThemeProvider>
          <RootNavigator/>
        </ThemeProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default App;