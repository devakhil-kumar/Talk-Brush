import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ManageProfile from '../../screens/mainScreens/profile/ManageProfile';
import EditProfile from '../../screens/mainScreens/profile/EditProfile';

const Stack = createNativeStackNavigator();

export default function UserProfileNavigator() {
    return (
        <Stack.Navigator  screenOptions={{
        headerShown: false, 
      }} >
            <Stack.Screen name="ManageProfile" component={ManageProfile} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}
