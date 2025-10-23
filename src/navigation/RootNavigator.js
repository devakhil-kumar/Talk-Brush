// src/navigation/RootNavigator.js
import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { loadInitialState } from '../app/features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import HomeNavigator from './HomeNavigator';
import AuthNavigator from './AuthNavigator'

const RootNavigator = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, mainloading } = useSelector((state) => state.auth);

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

    return isLoggedIn ? <HomeNavigator /> : <AuthNavigator />;
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