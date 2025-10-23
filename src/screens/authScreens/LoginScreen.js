import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Animated,
  Keyboard,
  Easing,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useDispatch } from 'react-redux';
import RnTextInput from '../../component/RnTextInput';
import CheckBox from '../../component/Checkbox';
import CommonBtn from '../../component/CommonBtn';
import GlobalStyles from '../../styles/GlobalStyles';
import { moderateScale } from 'react-native-size-matters';
import Images from '../../contexts/ImagePath'
import Fonts from '../../styles/GlobalFonts';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePath from '../../contexts/ImagePath';
import { validateForm } from '../authScreens/components/AuthValidator';
import { loginUser, registerUser } from '../../app/features/authSlice';


const LoginScreen = () => {

  const [tab, setTab] = useState('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [agree, setAgree] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch();


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
        isSignup,
        username,
        email,
        password,
        confirmPassword,
        phoneNumber,
        agree,
      });
      setValidationErrors(errors);
    }
  }, [username, email, password, confirmPassword, phoneNumber, agree]);

  const handleLoginTab = useCallback(() => {
    setTab('Login');
    setIsSubmitted(false);
    setEmail('');
    setPassword('');
    setPhoneNumber('')
    setUsername('');
    setRemember('')
    setConfirmPassword('');
    setValidationErrors({});
  }, []);

  const handleSignupTab = useCallback(() => {
    setTab('Signup');
    setIsSubmitted(false);
    setEmail('');
    setPhoneNumber('')
    setPassword('');
    setUsername('');
    setAgree('')
    setConfirmPassword('');
    setValidationErrors({});
  }, []);

  const handleRememberToggle = useCallback(() => {
    setRemember(prev => !prev);
  }, []);

  const handleAgreeToggle = useCallback(() => {
    setAgree(prev => !prev);
  }, []);

  const handleDismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const handleSubmitLogin = async () => {
    console.log("cnhsdkcbdfgcvhfdb")
    const errors = validateForm({ isSignup: false, email, password });
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
    }
    const userData = {
      email,
      password,
    }
    try {
      const response = await dispatch(loginUser(userData));
      console.log('login successful:', response);
    } catch (error) {
      console.log('login failed:', error);
    }
  };

  const hasErrors = Object.keys(validationErrors).length > 0;

  const handleSubmitSignUp = async () => {
    setIsSubmitted(true);
    const errors = validateForm({
      isSignup: true,
      username,
      email,
      password,
      confirmPassword,
      phoneNumber,
      agree
    });
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // return;
    }
    setValidationErrors({});
    const userData = {
      fullName: username,
      email,
      password,
      phoneNumber,
      type: "3",
    }
    console.log(userData, 'userData++++++++')
    try {
      const response = await dispatch(registerUser(userData)).unwrap();
      Alert.alert(
        'Signup Failed',
        response.message || 'An error occurred during signup. Please try again.',
        [
          {
            text: 'OK',
           onPress: () => {
            setTab('Login');
            setUsername('');
            setEmail('');
            setPhoneNumber('');
            setPassword('');
            setConfirmPassword('');
            setAgree(false);
            setValidationErrors({});
            setIsSubmitted(false);
          },
          }
        ]
      );
    } catch (error) {
      console.log('Signup failed:', error);
      if (typeof error === 'string') {
        errorMessage = error;
      }

      if (errorMessage.toLowerCase().includes('email already')) {
        Alert.alert(
          'Email Already Exists',
          'This email is already registered. Please use a different email or try logging in.',
          [
            {
              text: 'Try Another Email',
              onPress: () => console.log('User will enter different email')
            },
            {
              text: 'Go to Login',
              onPress: () => {
                // navigation.navigate('Login');
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Signup Failed',
          errorMessage,
          [
            {
              text: 'OK',
              onPress: () => console.log('Alert closed')
            }
          ]
        );
      }
    }
  };

  const isSignup = tab === 'Signup';
  const tabRowStyle = isSignup ? styles.tabRowSignup : styles.tabRowLogin;
  const boxStyle = isSignup ? styles.boxSignup : styles.boxLogin;
  const gapMaintain = !isSignup && styles.marginInput

  return (
    <ImageBackground
      source={Images.loginImage}
      style={styles.background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 0 : 0}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <TouchableWithoutFeedback onPress={handleDismissKeyboard} accessible={false}>
            <View style={styles.overlay}>
              <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
                <Image source={ImagePath.talkLogo} style={styles.logoHighlight} />
                <Text style={styles.subtitle}>
                  To make an accent suitable for {'\n'} an audience or purpose
                </Text>
              </Animated.View>

              <Animated.View style={[styles.cardContainer, { transform: [{ translateY: cardPosition }] }]}>
                <BlurView
                  style={styles.blurView}
                  blurType="dark"
                  blurAmount={8}
                  reducedTransparencyFallbackColor="rgba(89, 77, 91, 0.9)"
                />
                <View style={styles.card}>
                  <View style={styles.header}>
                    <View style={tabRowStyle}>
                      <TouchableOpacity onPress={handleLoginTab}>
                        <Text style={tab === 'Login' ? styles.activeTab : styles.inactiveTab}>
                          Login
                        </Text>
                      </TouchableOpacity>
                      <View style={styles.line} />
                      <TouchableOpacity onPress={handleSignupTab}>
                        <Text style={tab === 'Signup' ? styles.activeTab : styles.inactiveTab}>
                          Signup
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.infoText}>
                      Register Now to Personalize the {'\n'}English accent you listen to
                    </Text>
                  </View>
                  <ScrollView showsVerticalScrollIndicator={false}   >
                    <View style={boxStyle}>
                      {isSignup && (
                        <>
                          <RnTextInput
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            iconName="person-outline"
                            style={[
                              styles.firstInput,
                              validationErrors.username && styles.errorInput
                            ]}
                          />
                        </>
                      )}
                      <>
                        <RnTextInput
                          placeholder="Email Address"
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          iconName="mail"
                          style={[
                            validationErrors.email && styles.errorInput
                          ]}
                        />
                      </>

                      {isSignup && (
                        <>
                          <RnTextInput
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            iconName="phone-portrait"
                            style={[
                              validationErrors.phoneNumber && styles.errorInput,
                            ]}
                          />
                        </>
                      )}
                      <>
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
                      </>

                      {isSignup && (
                        <>
                          <RnTextInput
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            style={[
                              validationErrors.confirmPassword && styles.errorInput,
                            ]}
                          />
                          {validationErrors.confirmPassword && (
                            <Text style={styles.errorText}>{validationErrors.confirmPassword}</Text>
                          )}
                        </>
                      )}
                    </View>

                    {tab === 'Login' && (
                      <>
                        <CheckBox
                          checked={remember}
                          onPress={handleRememberToggle}
                          label="Remember Me"
                        />
                        {/* {isSubmitted && validationErrors.agree && (
                          <Text style={[styles.errorText, { marginTop: 0 }]}>{validationErrors.agree}</Text>
                        )} */}
                      </>
                    )}
                    {isSignup && (
                      <>
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
                      </>
                    )}
                    <CommonBtn title={tab === 'Login' ? 'LOGIN' : 'Sign Up'} onPress={tab === 'Login' ? handleSubmitLogin : handleSubmitSignUp} />
                  </ScrollView>
                </View>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: GlobalStyles.padding.medium,
  },
  headerContainer: {
    height: GlobalStyles.windowHeight / 3.5,
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
    flexShrink: 1,
    minHeight: GlobalStyles.windowHeight * 0.62,
    maxHeight: 500,
    marginTop: GlobalStyles.margin.medium * 2,
    width: GlobalStyles.windowWidth / 1.4,
    alignSelf: 'center',
    borderRadius: GlobalStyles.borderRadius.large,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(102, 88, 79, 0.3)',
    marginBottom: 15
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
    backgroundColor: 'rgba(102, 88, 79, 0.1)',
    borderRadius: GlobalStyles.borderRadius.large,
    padding: GlobalStyles.padding.small * 1.3,
  },
  tabRowLogin: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingTop: GlobalStyles.windowHeight * 0.03,
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
    color: '#7063F1',
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
  txt: {
    color: '#ccc',
    fontSize: moderateScale(14),
    fontFamily: Fonts.PoppinsRegular,
    textAlign: 'center',
    marginTop: GlobalStyles.margin.small / 2.2,
  },
  boxLogin: {
    marginTop: GlobalStyles.windowHeight * 0.07,
  },
  boxSignup: {
    marginTop: 0,
  },
  agreementText: {
    fontSize: moderateScale(9),
    color: '#6C63FF',
    marginLeft: GlobalStyles.margin.small,
    fontFamily: Fonts.PoppinsRegular
  },
  agreementBold: {
    color: '#fff',
    fontFamily: Fonts.PoppinsSemiBold
  },
  firstInput: {
    marginTop: 5
  },
  marginInput: {
    marginTop: GlobalStyles.margin.medium * 2
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
});