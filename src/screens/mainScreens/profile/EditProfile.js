import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Feather from '@react-native-vector-icons/feather';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, resetUpdateState } from "../../../app/features/profileSlice";
import ImagePath from '../../../contexts/ImagePath';
import GlobalStyles from '../../../styles/GlobalStyles';
import Fonts from '../../../styles/GlobalFonts';
import { showMessage } from '../../../app/features/messageSlice';

const EditProfile = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { user } = route.params;
    const dispatch = useDispatch();
    const { updateLoading, updateError, updateSuccess } = useSelector((state) => state.profile);
    console.log(updateSuccess, updateError, 'update++++++++++')

    const [name, setName] = useState(user?.fullName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phoneNumber || '');
    const [password] = useState('*********');

    useEffect(() => {
        if (updateSuccess) {
            dispatch(showMessage({ type: 'success', text: updateSuccess }));
            dispatch(resetUpdateState());
            navigation.goBack();
        }
        if (updateError) {
            dispatch(showMessage({ type: 'error', text: updateError }));
            dispatch(resetUpdateState());
        }
    }, [updateSuccess, updateError]);

    const handleUpdate = async () => {
        console.log("handleUpdate called"); 

        if (!name || !email || !phone) {
            console.log("Validation failed: Some fields are empty");
            dispatch(showMessage({ type: 'error', text: 'Please fill all required fields' }));
            return;
        }

        const payload = {
            fullName: name,
            email: email,
            phoneNumber: phone
        };
        console.log("Payload to dispatch:", payload);

        try {
            const resultAction = await dispatch(updateProfile(payload));
            console.log("Result from dispatch:", resultAction);

            if (updateProfile.fulfilled.match(resultAction)) {
                console.log("Profile update successful:", resultAction.payload);
                dispatch(showMessage({
                    type: 'success',
                    text: resultAction.payload.message || 'Profile updated successfully!'
                }));
                navigation.goBack();
            } else {
                console.log("Profile update failed:", resultAction.payload);
                dispatch(showMessage({
                    type: 'error',
                    text: resultAction.payload || 'Something went wrong'
                }));
            }
        } catch (error) {
            console.log("Unexpected error in handleUpdate:", error);
            dispatch(showMessage({
                type: 'error',
                text: error.message || 'An unexpected error occurred'
            }));
        }
    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.headermain}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name='chevron-left' color={'#000'} size={25} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={80}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View style={styles.container}>
                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                            <View style={styles.avatarContainer}>
                                <FontAwesome name="user" size={50} color="#555" />
                                <TouchableOpacity style={styles.editIcon}>
                                    <Image source={ImagePath.edit} style={{ width: 18, height: 18 }} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.header}>Edit Profile</Text>

                        <Text style={styles.label}>Name</Text>
                        <TextInput style={styles.input} value={name} onChangeText={setName} />

                        <Text style={styles.label}>Email</Text>
                        <TextInput style={styles.input} value={email} onChangeText={setEmail} />

                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput style={styles.input} value={phone} onChangeText={setPhone} />

                        <Text style={styles.label}>Password</Text>
                        <TextInput style={styles.input} value={password} secureTextEntry editable={false} />

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={styles.CancelBtn}
                                disabled={updateLoading}
                            >
                                <Text style={styles.cancel}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.updateButton}
                                onPress={handleUpdate}
                                disabled={updateLoading}
                            >
                                {updateLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.updateText}>Update</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 25 },
    header: { fontSize: 20, marginBottom: 10, marginTop: GlobalStyles.margin.large * 2, fontFamily: Fonts.PoppinsMedium },
    label: { fontSize: 14, color: '#555', marginBottom: 6, marginTop: 10 },
    input: {
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30 },
    cancel: { fontSize: 16, color: '#999' },
    updateButton: {
        backgroundColor: '#3340C4',
        paddingVertical: 10,
        paddingHorizontal: 28,
        borderRadius: 10,
    },
    CancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 28,
        borderRadius: 10,
        backgroundColor: '#E0E0E0',
    },
    updateText: { color: '#fff', fontSize: 16, fontWeight: '500' },
    headermain: {
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
    headerTitle: { fontSize: 16, fontWeight: '500', color: '#000' },
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
        borderColor: 'white',
    },
});
