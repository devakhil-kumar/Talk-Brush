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
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import RnTextInput from '../../component/RnTextInput';
import CheckBox from '../../component/Checkbox';
import CommonBtn from '../../component/CommonBtn';
import GlobalStyles from '../../styles/GlobalStyles';
import { moderateScale } from 'react-native-size-matters';
import Images from '../../contexts/ImagePath'
import Fonts from '../../styles/GlobalFonts';


const LoginScreen = () => {
  const [tab, setTab] = useState('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [agree, setAgree] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const cardPosition = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const cardScale = useRef(new Animated.Value(1)).current;


  const handleKeyboardShow = useCallback((e) => {
    setKeyboardVisible(true);
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
    console.log(-translation, 'translation')
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
    setKeyboardVisible(false);
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


  const handleLoginTab = useCallback(() => {
    setTab('Login');
    setEmail('');
    setPassword('');
    setUsername('');
    setConfirmPassword('');
  }, []);

  const handleSignupTab = useCallback(() => {
    setTab('Signup');
    setEmail('');
    setPassword('');
    setUsername('');
    setConfirmPassword('');
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

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const hideSub = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [handleKeyboardShow, handleKeyboardHide]);

  const isSignup = tab === 'Signup';
  const tabRowStyle = isSignup ? styles.tabRowSignup : styles.tabRowLogin;
  const boxStyle = isSignup ? styles.boxSignup : styles.boxLogin;

  return (
    <ImageBackground
      source={Images.loginImage}
      style={styles.background}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 0 : 0}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={handleDismissKeyboard} accessible={false}>
          <View style={styles.overlay}>
            <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
              <Text style={styles.logoHighlight}>TalkBrush</Text>
              <Text style={styles.subtitle}>
                Paint your voice {'\n'}with the right {'\n'}accent
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

                  <Text style={styles.txt}>Or</Text>
                </View>

                <View style={boxStyle}>
                  {isSignup && (
                    <RnTextInput
                      placeholder="Username"
                      value={username}
                      onChangeText={setUsername}
                      iconName="person-outline"
                      style={styles.firstInput}
                    />
                  )}
                  <RnTextInput
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    iconName="mail"
                  />

                  <RnTextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />

                  {isSignup && (
                    <RnTextInput
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                    />
                  )}
                </View>

                {tab === 'Login' && (
                  <CheckBox
                    checked={remember}
                    onPress={handleRememberToggle}
                    label="Remember Me"
                  />
                )}
                {isSignup && (
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
                )}
                <CommonBtn title={tab === 'Login' ? 'LOGIN' : 'Sign Up'} />
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>

      </KeyboardAvoidingView>

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
    fontSize: moderateScale(42),
    fontFamily: Fonts.OffsideRegular,
    textAlign: 'center',
    color: '#7063F1',
    lineHeight: 50,
  },
  subtitle: {
    fontSize: moderateScale(32),
    fontFamily: Fonts.PoppinsBold,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 38,
  },
  cardContainer: {
    flexShrink: 1,
    minHeight: GlobalStyles.windowHeight * 0.58,
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
    padding: GlobalStyles.padding.small * 1.5,
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
    marginTop: GlobalStyles.windowHeight * 0.03,
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
    marginTop: 0
  }
});