import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import RnTextInput from '../../../component/RnTextInput';
import { ResetPassword } from '../../../app/features/ResetPasswordSlice';
import { ToastAndroid } from "react-native";
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
import { useSelector, useDispatch } from "react-redux";
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@react-native-vector-icons/feather';
import { useTheme } from '../../../contexts/ThemeProvider';
import { moderateScale } from 'react-native-size-matters';
import Fonts from '../../../styles/GlobalFonts';
import { showMessage } from '../../../app/features/messageSlice';

const ResetPasswordScreen = ({ navigation }) => {
    const [email, setEmailText] = useState('');
    const { theme } = useTheme();
    const styles = style(theme)

    const dispatch = useDispatch();
    const { resetPassword, loading, error } = useSelector(
        state => state.forgetData
    );

    const handleSendOtp = async () => {
        try {
            if (!email || email.trim() === "") {
                dispatch(showMessage({ type: 'error', text: "Please enter your email" }));
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.trim())) {
                dispatch(showMessage({ type: 'error', text: "Please enter a valid email" }));
                return;
            }
            const res = await dispatch(ResetPassword(email.trim())).unwrap();
            dispatch(showMessage({ type: 'success', text: res.message }));
            setEmailText("");
            navigation.navigate("VerifyOtp", { email });
        } catch (err) {
            const msg =
                typeof err === "string"
                    ? err
                    : err?.message || "Something went wrong";

            dispatch(showMessage({ type: 'error', text: msg }));
        }
    };
  

    return (
        <SafeAreaView style={styles.pageBg} edges={['top']}>
            <View style={styles.headermain}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name='chevron-left' color={'#000'} size={25} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Forget Password</Text>
                <View style={{ width: 24 }} />
            </View>
            <Text style={styles.headerTextStyle}>Reset Password</Text>
            <Text style={styles.descriptionTextStyle}>Enter your email address to receive an OTP or password reset</Text>
            <Text style={[styles.descriptionTextStyle, { fontFamily: Fonts.InterSemiBold }]}>Email Address*</Text>
            <RnTextInput style={styles.textInputStyle} placeholder={'Enter your email'} value={email} onChangeText={setEmailText} placeholderTextColor={theme.text} textInput={{ color: theme.text }} />
            <View style={styles.buttonsRowStyle}>
                <TouchableOpacity style={styles.buttonStyle} onPress={handleSendOtp}>
                   {loading ?  <ActivityIndicator size={'small'} color={theme.white} /> : <Text style={styles.buttonTextStyle}>Send OTP</Text> }
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const style = (theme) => StyleSheet.create({
    pageBg: {
        flex: 1,
        padding: 16,
        backgroundColor: theme.background
    },
    headerTextStyle: {
        fontSize: moderateScale(18),
        color: theme.text,
        fontFamily: Fonts.InterSemiBold
    },
    descriptionTextStyle: {
        fontSize: moderateScale(15),
        color: theme.text,
        fontFamily: Fonts.InterRegular,
        marginTop: 16
    },
    textInputStyle: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        marginTop: 5,
        backgroundColor: theme.background
    },
    buttonsRowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 32
    },
    buttonStyle: {
        width: width * 0.4,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: theme.secandprimary,
    },
    buttonTextStyle: {
        fontSize: moderateScale(16),
        fontFamily: Fonts.InterMedium,
        color: theme.background
    },
    headermain: {
        height: 56,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: moderateScale(16),
        fontFamily: Fonts.InterSemiBold,
        color: theme.text,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background,
    },
})

export default ResetPasswordScreen;