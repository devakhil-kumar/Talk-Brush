import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

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

export default CheckBox;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#ffffffff",
    borderRadius: 10, 
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ffffffff",
  },
  label: {
    marginLeft: 8,
    color: "#fff",
    fontSize:12
  },
});
