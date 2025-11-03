import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ManageProfile from '../../Admin/screens/profile/ManageProfile';
import EditProfile from '../../Admin/screens/profile/EditProfile';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ManageProfile" component={ManageProfile} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}
