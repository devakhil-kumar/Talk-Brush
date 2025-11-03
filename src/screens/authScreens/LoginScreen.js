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
  ActivityIndicator,
} from 'react-native';
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
import { showMessage } from '../../app/features/messageSlice';
import { useNavigation } from '@react-navigation/native';


const LoginScreen = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
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
        email,
        password,
        agree,
      });
      setValidationErrors(errors);
    }
  }, [email, password, agree, isSubmitted]);

  const handleGoSignup = () => {
    navigation.replace('Signup')
  }

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
    setIsSubmitted(true);
    setIsLoading(true);
    try {
      const errors = validateForm({ email, password, isSignup: false }) || {};
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setIsLoading(false);
        return;
      }
      const userData = { email, password };
      const response = await dispatch(loginUser(userData)).unwrap();
      console.log(response, 'response+++++')
    } catch (error) {
      const errorMessage = typeof error === "string"
        ? error
        : error?.message || "Login failed!";
      if (errorMessage.toLowerCase().includes('invalid') ||
        errorMessage.toLowerCase().includes('credential')) {
        dispatch(
          showMessage({
            type: 'error',
            text: 'Invalid email or password',
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


  const tabRowStyle = styles.tabRowLogin;
  const boxStyle = styles.boxLogin;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={Images.loginImage}
        style={styles.background}
      >
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
                <View style={styles.card}>
                  <View style={styles.header}>
                    <View style={tabRowStyle}>
                      <TouchableOpacity>
                        <Text style={styles.activeTab}>
                          Login
                        </Text>
                      </TouchableOpacity>
                      <View style={styles.line} />
                      <TouchableOpacity >
                        <Text style={styles.inactiveTab}>
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
                      placeholder="Email Address"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      iconName="mail"
                      style={[
                        validationErrors.email && styles.errorInput
                      ]}
                    />
                    <RnTextInput
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      style={[
                        styles.marginInput,
                        validationErrors.password && styles.errorInput,
                      ]}
                    />
                    {validationErrors.password && (
                      <Text style={styles.errorText}>{validationErrors.password}</Text>
                    )}
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", width: '100%', justifyContent: "space-between", marginTop: GlobalStyles.margin.large }}>
                    <CheckBox
                      checked={remember}
                      onPress={handleRememberToggle}
                      label="Remember Me"
                    />
                    <Text style={{ fontSize: moderateScale(11), color: 'white', fontFamily: Fonts.PoppinsRegular }}>
                      Forgot Password?
                    </Text>
                  </View>

                  <CommonBtn title={'LOGIN'} onPress={handleSubmitLogin} />
                  <View style={styles.navigationContainer}>
                    <Text style={styles.navigationText}>
                      Don't have an Account?
                    </Text>
                    <TouchableOpacity onPress={handleGoSignup}>
                      <Text style={styles.navigationGoText}>Signup</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </View>
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

export default LoginScreen;

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
    width: GlobalStyles.windowWidth / 1.3,
    alignSelf: 'center',
    borderRadius: GlobalStyles.borderRadius.large,
    overflow: 'hidden',
    borderWidth: 3,
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
  tabRowLogin: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingTop: GlobalStyles.windowHeight * 0.03,
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
  boxLogin: {
    marginTop: GlobalStyles.windowHeight * 0.03,
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
    marginTop: GlobalStyles.margin.large * 2,
    alignSelf: 'center'
  },
  navigationText: {
    fontSize: moderateScale(13),
    fontFamily: Fonts.PoppinsRegular,
    color: 'white'
  },
  navigationGoText: {
    fontSize: moderateScale(13),
    fontFamily: Fonts.PoppinsRegular,
    color: '#FAB713',
    marginLeft: 5
  }
});