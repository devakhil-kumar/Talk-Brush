import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GlobalStyles from "../styles/GlobalStyles";
import { moderateScale } from "react-native-size-matters";
import Fonts from "../styles/GlobalFonts";


const CommonBtn = ({ title }) => {
    return (
        <TouchableOpacity style={styles.loginBtn}>
            <Text style={styles.loginText}>
                {title}
            </Text>
        </TouchableOpacity>
    )
};

export default memo(CommonBtn);

const styles = StyleSheet.create({
    loginBtn: {
        backgroundColor: '#7063F1',
        borderRadius: GlobalStyles.borderRadius.small,
        height:GlobalStyles.windowHeight/20,
        justifyContent:'center', 
        alignItems:'center'
    },
    loginText: {
        color: '#fff',
        fontSize: moderateScale(12),
        fontFamily:Fonts.PoppinsBold,
    }
})