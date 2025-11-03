import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from 'react-native';
import ImagePath from '../../contexts/ImagePath';
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../../styles/GlobalStyles";
import { moderateScale } from "react-native-size-matters";
import Fonts from "../../styles/GlobalFonts";

const SplashScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.main}>
            <Image source={ImagePath.talkLogo} style={styles.imageStyle} />
            <Text style={styles.text}>
                To make an accent suitable for {'\n'} an audience or purpose
            </Text>
        </View>
    )
}

export default SplashScreen;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    text: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: moderateScale(16),
        fontFamily: Fonts.PoppinsRegular,
        color: '#2D4CCA'
    },
    imageStyle: {
        width: GlobalStyles.windowWidth / 1.3,
        height: GlobalStyles.windowHeight / 4.3
    }
})