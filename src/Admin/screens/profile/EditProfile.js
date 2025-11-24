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
    Alert,
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
import { useTheme } from '../../../contexts/ThemeProvider';
import { moderateScale } from 'react-native-size-matters';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';


const EditProfile = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { user } = route.params;
    const dispatch = useDispatch();
    const { updateLoading, updateError, updateSuccess } = useSelector((state) => state.profile);
    const [name, setName] = useState(user?.fullName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phoneNumber || '');
    const [image, setImage] = useState(user?.image || null);

    const [password] = useState('*********');
    const { theme } = useTheme();
    const styles = style(theme);

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

    const convertToBase64 = async (uri) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error converting image to base64:', error);
            Alert.alert('Error', 'Failed to convert image');
            return null;
        }
    };

    const handlePickImage = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
            selectionLimit: 1,
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
                return;
            }
            
            if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                Alert.alert('Error', 'Failed to pick image');
                return;
            }

            if (!response.assets || !response.assets[0]) {
                console.log('No image selected');
                return;
            }

            try {
                const asset = response.assets[0];
                console.log('Original image URI:', asset.uri);
                const resized = await ImageResizer.createResizedImage(
                    asset.uri,
                    600,     // max width
                    600,     // max height
                    'JPEG',  // format
                    60,      // quality (0-100)
                    0        // rotation
                );
                const base64String = await convertToBase64(resized.uri);
                if (base64String) {
                    console.log('Image converted to base64 successfully');
                    setImage(base64String);
                } else {
                    Alert.alert('Error', 'Failed to process image');
                }
            } catch (err) {
                console.error("Image processing error:", err);
                Alert.alert('Error', 'Failed to process image: ' + err.message);
            }
        });
    };

    const handleUpdate = async () => {
        if (!name || !email || !phone) {
            dispatch(showMessage({ type: 'error', text: 'Please fill all required fields' }));
            return;
        }
        
        const payload = {
            fullName: name,
            email: email,
            phoneNumber: phone,
            image: image
        };
        
        try {
            const resultAction = await dispatch(updateProfile(payload));
            console.log("Update payload:", payload);
            
            if (updateProfile.fulfilled.match(resultAction)) {
                dispatch(showMessage({
                    type: 'success',
                    text: resultAction.payload.message || 'Profile updated successfully!'
                }));
                navigation.navigate('ManageProfile');
            } else {
                dispatch(showMessage({
                    type: 'error',
                    text: resultAction.payload || 'Something went wrong'
                }));
            }
        } catch (error) {
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
                                {image ? (
                                    <Image
                                        source={{ uri: image }}
                                        style={{ width: 90, height: 90, borderRadius: 45 }}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <FontAwesome name="user" size={50} color="#555" />
                                )}
                                <TouchableOpacity style={styles.editIcon} onPress={handlePickImage}>
                                    <Image source={ImagePath.edit} style={{ width: 18, height: 18 }} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.header}>Edit Profile</Text>

                        <Text style={styles.label}>Name</Text>
                        <TextInput style={styles.input} value={name} onChangeText={setName} />

                        <Text style={styles.label}>Email</Text>
                        <TextInput style={[styles.input, { color: 'gray' }]} value={email} onChangeText={setEmail} editable={false} />

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

const style = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, paddingHorizontal: 25 },
    header: { fontSize: 20, marginBottom: 10, marginTop: GlobalStyles.margin.large * 2, fontFamily: Fonts.PoppinsMedium },
    label: { fontSize: 14, color: theme.subText, marginBottom: 6, marginTop: 10, fontFamily: Fonts.InterRegular },
    input: {
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        padding: 12,
        fontSize: moderateScale(14),
        borderWidth: 1,
        borderColor: theme.border,
        fontFamily: Fonts.InterRegular
    },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30 },
    cancel: { fontSize: 16, color: '#999', fontFamily: Fonts.InterMedium },
    updateButton: {
        backgroundColor: theme.secandprimary,
        paddingVertical: 10,
        paddingHorizontal: 28,
        borderRadius: 10,
    },
    CancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 28,
        borderRadius: 10,
        backgroundColor: theme.border,
    },
    updateText: { color: theme.background, fontSize: moderateScale(15), fontFamily: Fonts.InterMedium },
    headermain: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.background,
        paddingHorizontal: 16,
        elevation: 4,
        shadowColor: theme.text,
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerTitle: {
        fontSize: moderateScale(16),
        fontFamily: Fonts.InterSemiBold,
        color: theme.text,
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
        borderColor: theme.background,
    },
});