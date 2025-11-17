import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, Text } from 'react-native';
import ImagePath from '../../contexts/ImagePath';
import AdminHome from '../../Admin/screens/home/AdminHome';
import UserList from '../../Admin/screens/users/UserList';
import ConvoSpace from '../../Admin/screens/convoSpace/ConvoSpace';
import Analytics from '../../Admin/screens/analytics /Analytics';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConvoSpaceStart from '../../Admin/screens/convoSpace/ConvoSpaceStart';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ConvoNavigator = () => {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ConvoSpaceMain" component={ConvoSpaceStart} />
      <Stack.Screen name="ConvoSpaceTalk" component={ConvoSpace} />

    </Stack.Navigator>
  );
};


const AdminBottomTabs = () => {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 10;
  return (
    <Tab.Navigator
      initialRouteName="Users"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          height: 65 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 8,

        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          color: '#fff',
        },

      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminHome}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.dashBoardActive : ImagePath.dashBoardInActive}
              style={{ width: 24, height: 24, resizeMode: 'contain' }}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? '#000000' : '#ccc', fontSize: 12 }}>Dashboard</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Users"
        component={UserList}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.userActive : ImagePath.userInActive}
              style={{ width: 24, height: 24, resizeMode: 'contain' }}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? '#000000' : '#ccc', fontSize: 12 }}>Users</Text>
          ),
        }}
      />

      <Tab.Screen
        name="ConvoSpace"
        component={ConvoNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.convoActive : ImagePath.convoInActive}
              style={{ width: 24, height: 24, resizeMode: 'contain' }}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? '#000000' : '#ccc', fontSize: 12 }}>ConvoSpace</Text>
          ),
        }}
      />

      <Tab.Screen
        name="Analytics"
        component={Analytics}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.analyticsActive : ImagePath.analyticsInActive}
              style={{ width: 24, height: 24, resizeMode: 'contain' }}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? '#000000' : '#ccc', fontSize: 12 }}>Analytics</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminBottomTabs;
