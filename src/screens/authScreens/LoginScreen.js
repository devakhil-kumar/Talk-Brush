import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { BlurView } from '@react-native-community/blur'; // or 'expo-blur' for Expo
import RnTextInput from '../../component/RnTextInput';
import CheckBox from '../../component/Checkbox';
const { height, width } = Dimensions.get('window');

const LoginScreen = () => {
  const [tab, setTab] = useState('Login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [agree, setAgree] = useState(true);

  return (
    <ImageBackground
      source={require('../../assets/image/loginScreen.png')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={{ flex: 0.6, justifyContent: 'flex-end'}}>
          <Text style={styles.logoHighlight}>TalkBrush</Text>
          <Text style={styles.subtitle}>
            Paint your voice {'\n'}with the right {'\n'}accent
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <BlurView
            style={styles.blurView}
            blurType="dark" 
            blurAmount={7}
            reducedTransparencyFallbackColor="rgba(89, 77, 91, 0.1)"
          />
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={[styles.tabRow, { paddingTop: tab === 'Signup' ? height * 0 : height * 0.03 }]}>
                <TouchableOpacity onPress={() => setTab('Login')}>
                  <Text
                    style={
                      tab === 'Login' ? styles.activeTab : styles.inactiveTab
                    }
                  >
                    Login
                  </Text>
                </TouchableOpacity>
                <View style={styles.line} />
                <TouchableOpacity onPress={() => setTab('Signup')}>
                  <Text
                    style={
                      tab === 'Signup' ? styles.activeTab : styles.inactiveTab
                    }
                  >
                    Signup
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.infoText}>
                Register Now to Personalize the {'\n'}English accent you listen to
              </Text>

              <Text style={styles.txt}>Or</Text>
            </View>

            <View style={[styles.box, { marginTop: tab === 'Signup' ? height * 0 : height * 0.05 }]}>
              {tab === 'Signup' && (
                <RnTextInput
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                />
              )}
              <RnTextInput
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              <RnTextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {tab === 'Signup' && (
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
                onPress={() => setRemember(!remember)}
                label="Remember Me"
              />
            )}
            {tab === 'Signup' && (
              <CheckBox
                checked={agree}
                onPress={() => setAgree(!agree)}
                label={
                  <Text style={{ fontSize: 12, color: '#6C63FF', marginLeft: 8 }}>
                    I agree to the{' '}
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                      privacy policy
                    </Text>{' '}
                    &
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                      {' '}
                      Terms and conditions
                    </Text>
                  </Text>
                }
              />
            )}
            <TouchableOpacity style={styles.loginBtn}>
              <Text style={styles.loginText}>
                {tab === 'Login' ? 'LOGIN' : 'SIGNUP'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16
  },
  header: { gap: 0 },
  logoHighlight: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#7063F1',
    lineHeight: 45
  },
  subtitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 39
  },
  cardContainer: {
    height: height / 1.8,
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden', 
    borderWidth: 4,
    borderColor: 'rgba(47, 47, 50, 0.2)',
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
    // backgroundColor: 'rgba(89, 77, 91, 0.3)',
    borderRadius: 20,
    padding: 16,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  activeTab: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 23,
  },
  inactiveTab: {
    color: '#7063F1',
    fontSize: 23,
  },
  line: { height: height * 0.06, width: 2, backgroundColor: 'grey' },
  infoText: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
  txt: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8
  },
  box: { marginTop: height * 0.04 },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#7063F1',
    borderRadius: 10,
    paddingHorizontal: width * 0.04,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#fff',
    borderRadius: 8,
    marginVertical: 8,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  rememberText: {
    color: '#fff',
    marginLeft: 5,
  },
  loginBtn: {
    backgroundColor: '#7063F1',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  loginText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});