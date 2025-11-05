// src/navigation/RootNavigator.js
import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { loadInitialState } from '../app/features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import HomeNavigator from '../navigation/UserNavigations/HomeNavigator';
import AuthNavigator from './AuthNavigator'
import AdminNavigator from './AdminNaigations/AdminNavigator';
import { showMessage } from '../app/features/messageSlice';

const RootNavigator = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, mainloading, userRole, token } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(loadInitialState());
    }, [dispatch]);

    if (mainloading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    console.log(isLoggedIn, token, userRole, 'userRole')

    if (isLoggedIn && token) {
        if (userRole === "2") {
            return <AdminNavigator />;
        } else if (userRole === "3") {
            return <HomeNavigator />;
        } 
    }

    return <AuthNavigator />
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});

export default RootNavigator;