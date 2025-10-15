import React, { memo } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import GlobalStyles from '../styles/GlobalStyles';
import Fonts from '../styles/GlobalFonts';
import { moderateScale } from 'react-native-size-matters';

const CheckBox = ({ checked, onPress, label }) => {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.outerCircle}>
        {checked && <View style={styles.innerCircle} />}
      </View>

      {typeof label === "string" ? (
        <Text style={styles.label}>{label}</Text>
      ) : (
        label
      )}
    </TouchableOpacity>
  );
};

export default memo(CheckBox);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop:GlobalStyles.margin.small,
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#ffffffff",
    borderRadius:GlobalStyles.borderRadius.medium, 
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius:GlobalStyles.borderRadius.small,
    backgroundColor: "#ffffffff",
  },
  label: {
    marginLeft:GlobalStyles.margin.small,
    color: "#fff",
    fontSize:moderateScale(11),
    fontFamily:Fonts.PoppinsRegular
  },

});
