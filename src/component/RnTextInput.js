import React, { memo, useState, useCallback } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import GlobalStyles from '../styles/GlobalStyles';
import { moderateScale } from 'react-native-size-matters';
import Ionicons from '@react-native-vector-icons/ionicons';
import Fonts from '../styles/GlobalFonts';

const RnTextInput = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  style,
  placeholderTextColor = '#fff',
  iconName,
  iconSize = 18,
  iconColor = '#fff',
  textInput
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = secureTextEntry;

  const handleTogglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <View style={[styles.inputContainer, style]}>

      {!isPasswordField && iconName && (
        <Ionicons
          name={iconName}
          size={iconSize}
          color={iconColor}
          style={styles.icon}
        />
      )}
      {isPasswordField && (
        <TouchableOpacity >
          <Ionicons
            name={'lock-closed'}
            size={18}
            color={iconColor}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
      <TextInput
        style={[styles.input, textInput]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPasswordField && !showPassword}
        keyboardType={keyboardType}
      />
       {isPasswordField && (
        <TouchableOpacity onPress={handleTogglePassword}>
          <Ionicons
            name={showPassword ? 'eye' : 'eye-off'}
            size={18}
            color={iconColor}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(RnTextInput);

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: '#FAB713',
    height: GlobalStyles.windowHeight / 17,
    borderRadius: GlobalStyles.borderRadius.small,
    paddingHorizontal: GlobalStyles.windowWidth * 0.03,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: GlobalStyles.margin.medium,
    width: '100%',
    backgroundColor: 'rgba(250, 183, 19, 0.2)',
  },
  input: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontFamily: Fonts.PoppinsRegular,
    height: '100%',
    width: '70%',
    paddingBottom: 6
  },
  icon: {
    padding: 5
  },
});
