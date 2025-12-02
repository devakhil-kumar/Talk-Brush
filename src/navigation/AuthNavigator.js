import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/authScreens/LoginScreen';
import SplashScreen from '../../src/screens/authScreens/SplashScreen';
import SignupScreen from '../screens/authScreens/SignupScreen';
import ResetPasswordScreen from '../screens/authScreens/forgetPasseord/ResetPasswordScreen';
import VerifyOTP from '../screens/authScreens/forgetPasseord/VerifyOtp';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          headerShown:false,
          contentStyle: {
            backgroundColor: '#1A1A1A',
            opacity: 1,
          },
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown:false,
          animationDuration: 150,
        }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          headerShown:false,
          animationDuration: 150,
        }}
      />
        <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
        options={{
          headerShown:false,
          animationDuration: 150,
        }}
      />
        <Stack.Screen
        name="VerifyOtp"
        component={VerifyOTP}
        options={{
          headerShown:false,
          animationDuration: 150,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
