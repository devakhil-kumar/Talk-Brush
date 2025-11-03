import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Easing, Image, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch } from "react-redux";
import GlobalStyles from "../../styles/GlobalStyles";
import RnTextInput from "../../component/RnTextInput";
import CheckBox from "../../component/Checkbox";
import CommonBtn from "../../component/CommonBtn";
import { validateForm } from "./components/AuthValidator";
import { registerUser } from "../../app/features/authSlice";
import { showMessage } from "../../app/features/messageSlice";
import Fonts from "../../styles/GlobalFonts";
import { moderateScale } from "react-native-size-matters";
import ImagePath from "../../contexts/ImagePath";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";


const SignupScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agree, setAgree] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation()


    const cardPosition = useRef(new Animated.Value(0)).current;
    const headerOpacity = useRef(new Animated.Value(1)).current;
    const cardScale = useRef(new Animated.Value(1)).current;


    const handleKeyboardShow = useCallback((e) => {
        const keyboardHeight = e.endCoordinates.height;
        const screenHeight = GlobalStyles.windowHeight;
        let minTranslation, maxTranslation;
        if (screenHeight <= 650) {
            minTranslation = screenHeight * 0.10;
            maxTranslation = screenHeight * 0.30;
        } else if (screenHeight <= 750) {
            minTranslation = screenHeight * 0.12;
            maxTranslation = screenHeight * 0.35;
        } else if (screenHeight <= 850) {
            minTranslation = screenHeight * 0.24;
            maxTranslation = screenHeight * 0.38;
        } else {
            minTranslation = screenHeight * 0.24;
            maxTranslation = screenHeight * 0.42;
        }
        let translation = keyboardHeight / 2.2;
        translation = Math.max(minTranslation, Math.min(translation, maxTranslation));
        Animated.parallel([
            Animated.timing(cardPosition, {
                toValue: -translation,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(headerOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(cardScale, {
                toValue: 0.95,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
    }, [cardPosition, headerOpacity, cardScale]);

    const handleKeyboardHide = useCallback(() => {
        Animated.parallel([
            Animated.timing(cardPosition, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(headerOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(cardScale, {
                toValue: 1,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
    }, [cardPosition, headerOpacity, cardScale]);


    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
        const hideSub = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, [handleKeyboardShow, handleKeyboardHide]);

    useEffect(() => {
        if (isSubmitted) {
            const errors = validateForm({
                isSignup: true,
                username,
                email,
                password,
                confirmPassword,
                phoneNumber,
                agree,
            });
            setValidationErrors(errors);
        }
    }, [username, email, password, confirmPassword, phoneNumber, agree, isSubmitted]);

    const handleAgreeToggle = useCallback(() => {
        setAgree(prev => !prev);
    }, []);

    const handleDismissKeyboard = useCallback(() => {
        Keyboard.dismiss();
    }, []);

    const handleGoLogin = () => {
        navigation.replace('Login')
    }

    const handleSubmitSignUp = async () => {
        setIsSubmitted(true);
        setIsLoading(true);
        const errors = validateForm({
            isSignup: true,
            username,
            email,
            password,
            confirmPassword,
            phoneNumber,
            agree,
        });
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setIsLoading(false);
            return;
        }
        setValidationErrors({});
        const userData = {
            fullName: username,
            email,
            password,
            phoneNumber,
            type: '3',
        };
        try {
            const response = await dispatch(registerUser(userData)).unwrap();
            dispatch(
                showMessage({
                    type: 'success',
                    text: response.message || 'Signup successful!',
                })
            );
            navigation.navigate('Login');
            setUsername('');
            setEmail('');
            setPhoneNumber('');
            setPassword('');
            setConfirmPassword('');
            setAgree(false);
            setValidationErrors({});
            setIsSubmitted(false);

        } catch (error) {
            let errorMessage = typeof error === 'string' ? error : error.message || 'Signup failed!';
            if (errorMessage.toLowerCase().includes('email already')) {
                dispatch(
                    showMessage({
                        type: 'error',
                        text: 'This email is already registered. Please use a different email or try logging in.',
                    })
                );
            } else {
                dispatch(
                    showMessage({
                        type: 'error',
                        text: errorMessage,
                    })
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const tabRowStyle = styles.tabRowSignup;
    const boxStyle = styles.boxSignup;
    const gapMaintain = styles.marginInput

    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground
                source={ImagePath.loginImage}
                style={styles.background}
            >
                <KeyboardAvoidingView
                    style={styles.keyboardAvoidingView}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <TouchableWithoutFeedback onPress={handleDismissKeyboard} accessible={false}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                            <View style={styles.overlay} >
                                <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
                                    <Image source={ImagePath.talkLogo} style={styles.logoHighlight} />
                                    <Text style={styles.subtitle}>
                                        To make an accent suitable for {'\n'} an audience or purpose
                                    </Text>
                                </Animated.View>

                                <Animated.View style={[styles.cardContainer, { transform: [{ translateY: cardPosition }] }]}>
                                    <View style={styles.card}>
                                        <View style={styles.header}>
                                            <View style={tabRowStyle}>
                                                <TouchableOpacity>
                                                    <Text style={styles.inactiveTab}>
                                                        Login
                                                    </Text>
                                                </TouchableOpacity>
                                                <View style={styles.line} />
                                                <TouchableOpacity>
                                                    <Text style={styles.activeTab}>
                                                        Signup
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.infoText}>
                                                Register Now to Personalize the {'\n'}English accent you listen to
                                            </Text>
                                        </View>

                                        <View style={boxStyle}>
                                            <RnTextInput
                                                placeholder="Full Name"
                                                value={username}
                                                onChangeText={setUsername}
                                                iconName="person-outline"
                                                style={[
                                                    gapMaintain,
                                                    styles.firstInput,
                                                    validationErrors.username && styles.errorInput
                                                ]}
                                            />
                                             {validationErrors.username && (
                                                <Text style={styles.errorText}>{validationErrors.username}</Text>
                                            )}
                                            <RnTextInput
                                                placeholder="Email Address"
                                                value={email}
                                                onChangeText={setEmail}
                                                keyboardType="email-address"
                                                iconName="mail"
                                                style={[
                                                    gapMaintain,
                                                    validationErrors.email && styles.errorInput
                                                ]}
                                            />
                                            {validationErrors.email && (
                                                <Text style={styles.errorText}>{validationErrors.email}</Text>
                                            )}
                                            <RnTextInput
                                                placeholder="Phone Number"
                                                value={phoneNumber}
                                                onChangeText={setPhoneNumber}
                                                iconName="phone-portrait"
                                                style={[
                                                    gapMaintain,
                                                    validationErrors.phoneNumber && styles.errorInput,
                                                ]}
                                            />
                                            <RnTextInput
                                                placeholder="Password"
                                                value={password}
                                                onChangeText={setPassword}
                                                secureTextEntry
                                                style={[
                                                    gapMaintain,
                                                    validationErrors.password && styles.errorInput,
                                                ]}
                                            />
                                            {validationErrors.password && (
                                                <Text style={styles.errorText}>{validationErrors.password}</Text>
                                            )}
                                            <RnTextInput
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChangeText={setConfirmPassword}
                                                secureTextEntry
                                                style={[
                                                    gapMaintain,
                                                    validationErrors.confirmPassword && styles.errorInput,
                                                ]}
                                            />
                                            {validationErrors.confirmPassword && (
                                                <Text style={styles.errorText}>{validationErrors.confirmPassword}</Text>
                                            )}
                                        </View>

                                        <View>
                                            <CheckBox
                                                checked={agree}
                                                onPress={handleAgreeToggle}
                                                label={
                                                    <Text style={styles.agreementText}>
                                                        I agree to the{' '}
                                                        <Text style={styles.agreementBold}>privacy policy</Text> &
                                                        <Text style={styles.agreementBold}> Terms and conditions</Text>
                                                    </Text>
                                                }
                                            />
                                            {isSubmitted && validationErrors.agree && (
                                                <Text style={[styles.errorText, { marginTop: 0 }]}>{validationErrors.agree}</Text>
                                            )}
                                        </View>
                                        <CommonBtn title={'Sign Up'} onPress={handleSubmitSignUp} />
                                        <View style={styles.navigationContainer}>
                                            <Text style={styles.navigationText}>
                                                Already have an Account?
                                            </Text>
                                            <TouchableOpacity onPress={handleGoLogin}>
                                                <Text style={styles.navigationGoText}>Login</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Animated.View>
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
                {isLoading && (
                    <View style={styles.loaderOverlay}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                )}
            </ImageBackground>
        </SafeAreaView>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#1A1A1A'
    },
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        backgroundColor: '#1A1A1A'
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: GlobalStyles.padding.medium,
    },
    headerContainer: {
        height: GlobalStyles.windowHeight /4.6,
        justifyContent: 'flex-end',
    },
    header: {
        gap: 0,
    },
    logoHighlight: {
        width: GlobalStyles.windowWidth / 1.8,
        height: GlobalStyles.windowHeight / 5.8,
        alignSelf: 'center'
    },
    subtitle: {
        fontSize: moderateScale(15),
        fontFamily: Fonts.PoppinsRegular,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 14,
        marginTop: GlobalStyles.margin.medium * 1.5
    },
    cardContainer: {
        minHeight: GlobalStyles.windowHeight * 0.75,
        // maxHeight: 500,
        marginTop: GlobalStyles.margin.medium * 2,
     width: GlobalStyles.windowWidth / 1.3,
        alignSelf: 'center',
        borderRadius: GlobalStyles.borderRadius.large,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(102, 88, 79, 0.3)',
        marginBottom: 15,
        backgroundColor: 'rgba(60, 45, 35, 0.55)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    blurView: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    card: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderRadius: GlobalStyles.borderRadius.large,
        padding: GlobalStyles.padding.small * 1.5,
        shadowColor: 'rgba(255, 200, 150, 0.25)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    },
    tabRowSignup: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        paddingTop: 0,
    },
    activeTab: {
        color: '#fff',
        fontSize: moderateScale(23),
        fontFamily: Fonts.PoppinsBold,
    },
    inactiveTab: {
        color: '#FAB713',
        fontSize: moderateScale(23),
        fontFamily: Fonts.PoppinsRegular,
    },
    line: {
        height: GlobalStyles.windowHeight * 0.06,
        width: 2,
        backgroundColor: 'grey',
    },
    infoText: {
        color: '#ccc',
        fontSize: moderateScale(12),
        fontFamily: Fonts.PoppinsRegular,
        textAlign: 'center',
        marginTop: GlobalStyles.margin.medium,
    },
    boxSignup: {
        marginTop: 0,
    },
    agreementText: {
        fontSize: moderateScale(9),
        color: '#FAB713',
        marginLeft: GlobalStyles.margin.small,
        fontFamily: Fonts.PoppinsRegular,
        marginTop: 10
    },
    agreementBold: {
        color: '#fff',
        fontFamily: Fonts.PoppinsSemiBold
    },
    firstInput: {
        marginTop: 5
    },
    marginInput: {
        marginTop: GlobalStyles.margin.medium * 1.8
    },
    errorInput: {
        borderColor: 'red',
        borderWidth: 1,
    },
    errorText: {
        color: 'red',
        fontSize: 8,
        marginTop: 4,
        marginLeft: 5,
    },
    loaderOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    navigationContainer: {
        flexDirection: 'row',
        marginTop: 15,
        alignSelf: 'center'
    },
    navigationText: {
        fontSize: moderateScale(12),
        fontFamily: Fonts.PoppinsRegular,
        color: 'white'
    },
    navigationGoText: {
        fontSize: moderateScale(12),
        fontFamily: Fonts.PoppinsRegular,
        color: '#FAB713',
        marginLeft: 5
    }
});