import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import RnTextInput from '../../../component/RnTextInput';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../contexts/ThemeProvider';
import Fonts from '../../../styles/GlobalFonts';
import Feather from '@react-native-vector-icons/feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlobalStyles from '../../../styles/GlobalStyles';

const ContactUS = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const styles = style(theme);

    return (
        <SafeAreaView>
            <View style={styles.pageBg}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name='chevron-left' color={theme.text} size={25} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Contact Us</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.topRowStyle}>
                    <MaterialIcons
                        name="mail-outline"
                        size={35}
                        color="red"
                    />
                    <Text style={styles.contactUsStyle}>Contact Us</Text>
                </View>
                <Text style={styles.descriptionTextStyle}>We'd love to hear from you! Send us a message and we'll get back to you as soon as possible.</Text>

                <View style={{ marginTop: 10 }}>
                    <Text style={styles.hintTextStyle}>Your Name</Text>
                    <RnTextInput style={styles.customTextInputStyle} placeholder={'John Doe'} placeholderTextColor='gray' />
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={styles.hintTextStyle}>Email Address</Text>
                    <RnTextInput style={styles.customTextInputStyle} placeholder={'you@example.com'} placeholderTextColor='gray' />
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={styles.hintTextStyle}>Message</Text>
                    <RnTextInput style={[styles.customTextInputStyle, { height: GlobalStyles.windowHeight * 0.2 }]} textInput={{
                        textAlignVertical: 'top',
                        textAlign: 'left'
                    }} placeholder={'How can we help you?'} multiline={true} placeholderTextColor='gray' />
                </View>

                <TouchableOpacity
                    style={{
                        backgroundColor: 'red',
                        paddingVertical: 16,
                        paddingHorizontal: 24,
                        flexDirection: 'row',
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                        marginTop: 20
                    }}
                >
                    <MaterialIcons
                        name="send"
                        size={20}
                        color="white"
                    />
                    <Text style={{ marginStart: 10, fontWeight: '600', fontSize: 18, color: 'white' }}>Send Message</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    )
}

const style = (theme) => StyleSheet.create({
    pageBg: {
        paddingHorizontal: 16,
    },
    topRowStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 30
    },
    contactUsStyle: {
        fontSize: 24,
        fontWeight: '800',
        color: 'black',
        marginStart: 10
    },
    descriptionTextStyle: {
        fontSize: 14,
        color: 'grey',
        fontWeight: '500',
        marginTop: 10
    },
    hintTextStyle: {
        fontSize: 16,
        fontWeight: '400',
        color: 'black'
    },
    customTextInputStyle: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        backgroundColor: '#fff',
        color: '#0000',
        textAlignVertical: 'top',
        textAlign: 'left'
    },
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.background,
        elevation: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: Fonts.InterBold,
        color: theme.text,
    }
});

export default ContactUS;