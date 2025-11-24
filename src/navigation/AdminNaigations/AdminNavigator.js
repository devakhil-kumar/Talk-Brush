import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AdminBottomTabs from '../../navigation/AdminNaigations/AdminBottomBar';
import ImagePath from '../../contexts/ImagePath';
import Event from '../../Admin/screens/event/Event';
import CustomHeader from '../../Admin/components/CustomHeader';
import ProfileNavigator from '../../navigation/AdminNaigations/ProfileNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../app/features/authSlice';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Delete from '../../Admin/screens/deleteMyAccount/Delete';
import Notification from '../../screens/mainScreens/notification/Notification';
import Activities from '../../screens/mainScreens/activities/Activities';
import Feather from '@react-native-vector-icons/feather';
import ContactUs from '../../Admin/screens/utilities/ContactUs';
import PrivacyPolicy from '../../Admin/screens/utilities/PrivacyPolicy';
import TermsConditions from '../../Admin/screens/utilities/Terms&Conditions';
import { getUserData } from '../../units/asyncStorageManager';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const dispatch = useDispatch();
   const [user, setUser] = useState(null);
    useEffect(() => {
      const loadUser = async () => {
        const stored = await getUserData('userProfile');
        if (stored?.user) {
          setUser(stored.UserProfile?.user);
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
            .filter(route => route.name !== 'notification' && route.name !== 'Activities')
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

const AdminDrawer = () => {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 10;
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        header: ({ navigation }) => <CustomHeader navigation={navigation} />,
        drawerActiveTintColor: '#FAB713',
        drawerInactiveTintColor: '#ccc',
        drawerLabelStyle: { fontSize: 15 },
        drawerStyle: {
          paddingBottom: bottomInset,
          paddingTop: 20,
        }
      }}
    >
      <Drawer.Screen
        name="DashBorad"
        component={AdminBottomTabs}

        options={{
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.Home : ImagePath.Home}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile Settings"
        component={ProfileNavigator}
        options={{
          headerShown: false,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.profileActive : ImagePath.profileInActive}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Event"
        component={Event}
        options={{
          headerShown: false,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.eventIcon : ImagePath.eventLight}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Delete"
        component={Delete}
        options={{
          headerShown: false,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.eventIcon : ImagePath.eventLight}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="notification"
        component={Notification}
        options={{
          headerShown: true,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.eventIcon : ImagePath.eventLight}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Activities"
        component={Activities}
        options={{
          headerShown: true,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.eventIcon : ImagePath.eventLight}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Contact Us"
        component={ContactUs}
        options={{
          headerShown: false,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.eventIcon : ImagePath.eventLight}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Privacy Policy"
        component={PrivacyPolicy}
        options={{
          headerShown: false,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.eventIcon : ImagePath.eventLight}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Terms & Conditions"
        component={TermsConditions}
        options={{
          headerShown: false,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? ImagePath.eventIcon : ImagePath.eventLight}
              style={{ width: 22, height: 22, resizeMode: 'contain' }}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const AdminNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDrawer" component={AdminDrawer} />
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
  menuWrapper: {
    paddingTop: 10,
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

export default AdminNavigator;