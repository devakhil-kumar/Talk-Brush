import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../../../app/features/authSlice";


const AdminHome = () => {

    return (
        <View>
            <Text>
                Admin Login
            </Text>
            {/* <TouchableOpacity style={{ marginTop: 40, height: 30, width: 150, backgroundColor: 'red' }} onPress={handleLogout} >
                <Text>
                    Logout
                </Text>
            </TouchableOpacity> */}
        </View>
    )
}

export default AdminHome;