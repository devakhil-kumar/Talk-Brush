import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, Text, Platform } from 'react-native';
import ImagePath from '../../contexts/ImagePath';
import ConvoSpace from '../../Admin/screens/convoSpace/ConvoSpace';
import AdminHome from '../../Admin/screens/home/AdminHome';
import ProfileNavigator from '../../navigation/AdminNaigations/ProfileNavigator';
import Events from '../../screens/mainScreens/events/Events';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConvoNavigator } from '../AdminNaigations/AdminBottomBar'



const Tab = createBottomTabNavigator();

const UserBottomBar = () => {
    const insets = useSafeAreaInsets();
    const bottomInset = Platform.OS === 'android' ? insets.bottom : 10;
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                keyboardHidesTabBar: true,
                tabBarStyle: {
                    borderTopWidth: 0,
                    height: 65 + bottomInset,
                    paddingBottom: bottomInset,
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
                name="Profile"
                component={ProfileNavigator}
                options={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'ManageProfile';
                    return {
                        tabBarStyle: {
                            display: routeName === 'EditProfile' ? 'none' : 'flex',
                            height: 65 + bottomInset,
                            paddingBottom: bottomInset,
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
