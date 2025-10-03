import React from 'react';
import { Dimensions, StyleSheet, TextInput, View } from 'react-native';

const { width } = Dimensions.get('window');

const RnTextInput = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  style,
  placeholderTextColor = '#fff',
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, style]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
};

export default RnTextInput;

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: '#6C63FF',
    borderRadius: 8,
    paddingHorizontal: width * 0.04,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    width:'100%',
    backgroundColor: 'rgba(112, 99, 241, 0.2)'
  },
  input: {
    color: '#fff',
    borderRadius: 8,
    paddingLeft : width * 0.04,
    paddingVertical: 12,
    fontSize:12
  },
});
