import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../../app/features/authSlice";


const HomeScreen = () => {
    const dispatch = useDispatch();

    const handleLogout = async () => {
        console.log('bcsdkcbgf')
        dispatch(logout());
    };

    return (
        <View>
            <Text>
                vdfvfdgbfdgb
            </Text>
            <TouchableOpacity style={{ marginTop: 40, height: 30, width: 150, backgroundColor: 'red' }} onPress={handleLogout} >
                <Text>
                    Logout
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default HomeScreen;