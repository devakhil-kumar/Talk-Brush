import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ThemeProvider } from './src/contexts/ThemeProvider';
import RootNavigator from './src/navigation/RootNavigator';
import store from './src/app/store'
import { Provider, useDispatch, useSelector } from 'react-redux';
import CustomMessage from './src/component/CustomMessage';
import { hideMessage } from './src/app/features/messageSlice';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const GlobalMessageWrapper = () => {
  const { visible, text, type } = useSelector(state => state.message);
  const dispatch = useDispatch();

  return (
    <>
      <RootNavigator />
      <CustomMessage
        visible={visible}
        text={text}
        type={type}
        onHide={() => dispatch(hideMessage())}
      />
    </>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
    <Provider store={store}>
      <NavigationContainer>
        <ThemeProvider>
          <GlobalMessageWrapper />
        </ThemeProvider>
      </NavigationContainer>
    </Provider>
</SafeAreaProvider>
  );
};

export default App;