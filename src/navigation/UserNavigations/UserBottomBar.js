import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, Text } from 'react-native';
import ImagePath from '../../contexts/ImagePath';
import ConvoSpace from '../../Admin/screens/convoSpace/ConvoSpace';
import HomeScreen from '../../screens/mainScreens/home/HomeScreen';
import UserProfileNavigator from './UserProfileNavigator';
import Events from '../../screens/mainScreens/events/Events';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';



const Tab = createBottomTabNavigator();

const UserBottomBar = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                keyboardHidesTabBar: true,
                tabBarStyle: {
                    borderTopWidth: 0,
                    height: 65,
                    paddingBottom: 8,
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
                component={HomeScreen}
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
                name="Event"
                component={Events}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={focused ? ImagePath.eventIcon : ImagePath.eventLight}
                            style={{ width: 24, height: 24, resizeMode: 'contain' }}
                        />
                    ),
                    tabBarLabel: ({ focused }) => (
                        <Text style={{ color: focused ? '#000000' : '#ccc', fontSize: 12 }}>Events</Text>
                    ),
                }}
            />

            <Tab.Screen
                name="ConvoSpace"
                component={ConvoSpace}
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
                name="Profile"
                component={UserProfileNavigator}
                options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'ManageProfile';
                    return {
                        tabBarStyle: {
                            display: routeName === 'EditProfile' ? 'none' : 'flex',
                            height: 65,
                            paddingBottom: 8,
                        },
                        tabBarIcon: ({ focused }) => (
                            <Image
                                source={focused ? ImagePath.profileActive : ImagePath.profileInActive}
                                style={{ width: 24, height: 24, resizeMode: 'contain' }}
                            />
                        ),
                        tabBarLabel: ({ focused }) => (
                            <Text style={{ color: focused ? '#000000' : '#ccc', fontSize: 12 }}>Profile</Text>
                        ),
                    };
                }}
            />
        </Tab.Navigator>
    );
};

export default UserBottomBar;
