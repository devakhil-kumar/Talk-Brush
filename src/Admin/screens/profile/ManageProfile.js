import React, { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from '@react-native-vector-icons/feather';
import FontAwesome from "@react-native-vector-icons/fontawesome";
import { useNavigation } from "@react-navigation/native";
import ImagePath from "../../../contexts/ImagePath";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../../app/features/profileSlice";


const ManageProfile = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { user, loading } = useSelector(state => state.profile);

    useEffect(() => {
        dispatch(fetchProfile())
    }, []
    )

    if (loading || !user) {
        return (
            <View style={style.loaderContainer}>
                <ActivityIndicator size="large" color="#3340C4" />
            </View>
        );
    }

    return (
        <SafeAreaView>
            <View style={style.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name='chevron-left' color={'#0000'} size={25} />
                </TouchableOpacity>
                <Text style={style.headerTitle}>Profile Settings</Text>
                <View style={{ width: 24 }} />
            </View>
            <View style={{ alignItems: "center", marginTop: 20 }}>
                <View style={style.avatarContainer}>
                    <FontAwesome name="user" size={50} color="#555" />
                    <TouchableOpacity style={style.editIcon}>
                        <Image source={ImagePath.edit} style={{ width: 18, height: 18 }} />
                    </TouchableOpacity>
                </View>
                <>
                    <Text style={style.name}>{user?.fullName || ''}</Text>
                    <Text style={style.info}>{user?.email || ''} | {user?.phoneNumber || ''}</Text>
                </>
                <TouchableOpacity style={style.editButton} onPress={() => navigation.navigate('EditProfile', { user: user })}>
                    <Text style={style.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ManageProfile;

const style = StyleSheet.create({
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
    avatarContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#E9F2FF',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'lightgray',
        borderRadius: 12,
        padding: 4,
        borderWidth: 1,
        borderColor: 'white'
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginTop: 12,
    },
    info: {
        fontSize: 13,
        color: '#555',
        marginTop: 4,
        textAlign: 'center',
    },
    editButton: {
        marginTop: 16,
        paddingVertical: 8,
        paddingHorizontal: 22,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#5570F1',
    },
    editButtonText: {
        color: '#5570F1',
        fontWeight: '500',
        fontSize: 14,
    },
     loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    }
})