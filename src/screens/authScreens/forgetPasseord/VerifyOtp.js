import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import RnTextInput from '../../../component/RnTextInput';
import { Dimensions } from 'react-native';
import { useState } from 'react';
const { width } = Dimensions.get('window');
import { useSelector, useDispatch } from "react-redux";
import { VerifyResetCode } from '../../../app/features/ResetPasswordSlice';
import { ToastAndroid } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts/ThemeProvider';
import { moderateScale } from 'react-native-size-matters';
import Fonts from '../../../styles/GlobalFonts';
import Feather from '@react-native-vector-icons/feather';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from '../../../app/features/messageSlice';

const VerifyOtp = ({ route }) => {
    const { email } = route.params;
    const [otp, setOtpText] = useState('');
    const [newPassword, setNewPasswordText] = useState('');
    const [confirmPassword, setConfirmPasswordText] = useState('');
    const { theme } = useTheme();
    const styles = style(theme);
    const navigation = useNavigation();

    const dispatch = useDispatch();
    const { resetCode, loading, error } = useSelector(
        state => state.forgetData
    );

    const handleVerifyOtp = async () => {
        try {
            if (!otp || otp.trim() === "") {
                dispatch(showMessage({ type: 'error', text: "Please enter the OTP." }));
                return;
            }

            if (!newPassword || newPassword.trim() === "") {
                dispatch(showMessage({ type: 'error', text: "Please enter new password." }));
                return;
            }

            const passwordRegex =
                /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            if (!passwordRegex.test(newPassword.trim())) {
                dispatch(showMessage({
                    type: 'error',
                    text: "Password must contain 1 uppercase, 1 number, 1 special character and be at least 8 characters."
                }));
                return;
            }

            if (!confirmPassword || confirmPassword.trim() === "") {
                dispatch(showMessage({ type: 'error', text: "Please enter confirm password." }));
                return;
            }

            if (newPassword.trim() !== confirmPassword.trim()) {
                dispatch(showMessage({ type: 'error', text: "Passwords do not match." }));
                return;
            }
            const data = {
                email: email.trim(),
                code: otp.trim(),
                newPassword: newPassword.trim()
            };
            console.log(data, "data");
            const res = await dispatch(VerifyResetCode(data)).unwrap();
            dispatch(showMessage({ type: 'success', text: res.message }));
            navigation.pop(2);
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
                <Text style={styles.headerTitle}>Reset Password</Text>
                <View style={{ width: 24 }} />
            </View>
            <Text style={styles.headerTextStyle}>Verify OTP</Text>
            <Text style={styles.descriptionTextStyle}>Enter the OTP sent to your email and set a new password</Text>
            <Text style={[styles.descriptionTextStyle]}>OTP Code*</Text>
            <RnTextInput style={styles.textInputStyle} placeholder={'Enter 4-digit OTP'} text={otp} onChangeText={setOtpText} placeholderTextColor={theme.text} textInput={{ color: theme.text }} />
            <Text style={[styles.descriptionTextStyle]}>New Password*</Text>
            <RnTextInput style={styles.textInputStyle} placeholder={'Enter new password'} text={newPassword} onChangeText={setNewPasswordText} placeholderTextColor={theme.text} textInput={{ color: theme.text }} secureTextEntry iconColor={theme.text} />
            <Text style={[styles.descriptionTextStyle]}>Confirm New Password*</Text>
            <RnTextInput style={styles.textInputStyle} placeholder={'Confirm new password'} text={confirmPassword} onChangeText={setConfirmPasswordText} secureTextEntry placeholderTextColor={theme.text} textInput={{ color: theme.text }} iconColor={theme.text} />
            <View style={styles.buttonsRowStyle}>
                <TouchableOpacity style={[styles.buttonStyle, { width: width * 0.4, borderWidth: 1, borderColor: theme.border, borderRadius: 10, }]}>
                    <Text style={styles.buttonTextStyle}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonStyle, { width: width * 0.4, backgroundColor: theme.secandprimary, }]} onPress={handleVerifyOtp}>
                     {loading ?  <ActivityIndicator size={'small'} color={theme.white} /> : <Text style={[styles.buttonTextStyle, { color: 'white' }]}>Reset Password</Text> }
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const style = (theme) => StyleSheet.create({
    pageBg: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white'
    },
    headerTextStyle: {
        fontSize: moderateScale(18),
        color: theme.text,
        fontFamily: Fonts.InterSemiBold
    },
    descriptionTextStyle: {
        fontSize: moderateScale(16),
        color: theme.text,
        fontFamily: Fonts.InterMedium,
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

        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
    },
    buttonTextStyle: {
        fontSize: moderateScale(14),
        color: theme.text,
        fontFamily: Fonts.InterSemiBold
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
});

export default VerifyOtp;