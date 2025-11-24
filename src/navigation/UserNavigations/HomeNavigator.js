import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import ImagePath from '../../contexts/ImagePath';
import CustomHeader from '../../Admin/components/CustomHeader';
import UserBottomBar from '../UserNavigations/UserBottomBar';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../app/features/authSlice';
import Activities from '../../screens/mainScreens/activities/Activities'
import Feather from '@react-native-vector-icons/feather';
import { getUserData } from '../../units/asyncStorageManager';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props, navigation) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const loadUser = async () => {
      const stored = await getUserData('userProfile');
      if (stored?.user) {
        setUser(stored.user);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView style={styles.drawerWrapper} edges={['top']} >
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: user?.image }}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.fullName || ''}</Text>
            <Text style={styles.profileEmail}>{user?.email || ''} </Text>
          </View>
        </View>
        <View style={styles.menuSection}>
          {props.state.routes
            .filter(route => route.name !== 'Activities')
            .map((route, index) => {
              const { drawerIcon, drawerLabel } =
                props.descriptors[route.key].options;
              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={() => props.navigation.navigate(route.name)}
                  style={styles.menuItem}
                >
                  <View style={styles.iconLeft}>
                    {drawerIcon && drawerIcon({ focused: false })}
                  </View>
                  <Text style={styles.menuLabel}>
                    {drawerLabel || route.name}
                  </Text>
                  <Feather name={'chevron-right'} size={20} color='#0000' />
                </TouchableOpacity>
              );
            })}
        </View>
      </DrawerContentScrollView>

      <View style={styles.logoutSection}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Image
            source={ImagePath.logout}
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const HomeDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: '#FAB713',
        drawerInactiveTintColor: '#ccc',
        drawerLabelStyle: { fontSize: 15 },
      }}
    >
      <Drawer.Screen
        name="DashBorad"
        component={UserBottomBar}
        options={({ navigation, route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Dashboard';
          const hideHeader = routeName === 'Profile' || routeName === 'Event';;
          return {
            header: hideHeader ? undefined : () => <CustomHeader navigation={navigation} />,
            headerShown: hideHeader ? false : true,
            drawerIcon: ({ focused }) => (
              <Image
                source={focused ? ImagePath.Home : ImagePath.Home}
                style={{ width: 22, height: 22, resizeMode: 'contain' }}
              />
            ),
            drawerLabel: 'Dashboard',
          };
        }}
      />
      <Drawer.Screen
        name="Activities"
        component={Activities}
        options={({ navigation }) => {
          return {
            header: ({ navigation }) => <CustomHeader navigation={navigation} />,
            headerShown: true,
            drawerIcon: ({ focused }) => (
              <Image
                source={focused ? ImagePath.eventIcon : ImagePath.eventLight}
                style={{ width: 22, height: 22, resizeMode: 'contain' }}
              />
            ),
          }
        }
        }
      />
      {/* <Drawer.Screen
        name="Profile Settings"
        component={UserProfileNavigator}
        options={{
          headerShown: false,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.profileActive : ImagePath.profileInActive}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          ),
        }}
      /> */}
      {/* <Drawer.Screen
        name="Event"
        component={Event}
        options={{
          headerShown: false,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.eventIcon : ImagePath.eventIcon}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          ),
        }}
      /> */}
    </Drawer.Navigator>
  );
};

const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeDrawer" component={HomeDrawer} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerWrapper: {
    flex: 1,
  },
  drawerContainer: {
    flexGrow: 1,
    paddingTop: 0,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: '#6B7280',
  },
  menuSection: {
    flex: 1,
    paddingTop: 8,
  },
  logoutSection: {
    // borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 40
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginRight: 12,
    // tintColor: '#EF4444',
  },
  logoutText: {
    fontSize: 15,
    // color: '#EF4444',
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  iconLeft: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },
  menuLabel: {
    fontSize: 15,
    color: "#111",
    flex: 1,
  },
});

export default HomeNavigator;