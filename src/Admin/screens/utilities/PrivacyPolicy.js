import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@react-native-vector-icons/feather';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../contexts/ThemeProvider';
import Fonts from '../../../styles/GlobalFonts';

const PrivacyPolicy = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const styles = style(theme);
    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={
                styles.pageBg
            }>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name='chevron-left' color={theme.text} size={25} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Privacy Policy</Text>
                    <View style={{ width: 24 }} />
                </View>
                <ScrollView
                    style={styles.scrollViewStyle}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.topRowStyle}>
                        <MaterialIcons
                            name="privacy-tip"
                            size={35}
                            color="purple"
                        />
                        <Text style={styles.privacyPolicyHeaderStyle}>Privacy Policy</Text>
                    </View>
                    <Text style={styles.effectiveDateStyle}>Effective Date: November 15, 2025</Text>

                    <View>
                        <View style={styles.contentHeaderRowStyle}>
                            <View style={styles.verticalLineStyle} />
                            <Text style={styles.contentHeaderTextStyle}>1. Information We Collect</Text>
                        </View>
                        <Text style={styles.contentDescriptionStyle}>We collect several types of information for various purposes to provide and improve our service to you.{"\n"}{"\n"}
                            a{")."} Personal Data: Includes name, email address, phone number, and other identifiers when voluntarily provided.{"\n"}
                            b{")."} Usage Data: Information on how the service is accessed and used, such as IP address, browser type, and pages visited.{"\n"}
                            c{")."} Cookies: We use cookies and similar tracking technologies to track activity on our service and hold certain information.{"\n"}</Text>
                    </View>

                    <View >
                        <View style={styles.contentHeaderRowStyle}>
                            <View style={styles.verticalLineStyle} />
                            <Text style={styles.contentHeaderTextStyle}>2. Use of Data</Text>
                        </View>
                        <Text style={styles.contentDescriptionStyle}>The collected data is used for purposes including: providing and maintaining the service, notifying you about changes, enabling interactive features, providing customer support, monitoring usage, and detecting/preventing technical issues.</Text>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <View style={styles.contentHeaderRowStyle}>
                            <View style={styles.verticalLineStyle} />
                            <Text style={styles.contentHeaderTextStyle}>3. Data Security</Text>
                        </View>
                        <Text style={styles.contentDescriptionStyle}>The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</Text>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <View style={styles.contentHeaderRowStyle}>
                            <View style={styles.verticalLineStyle} />
                            <Text style={styles.contentHeaderTextStyle}>4. Your Data Protection Rights</Text>
                        </View>
                        <Text style={styles.contentDescriptionStyle}>Depending on your location, you may have the right to access, update, or delete the personal information we hold about you. Please contact us to exercise these rights.</Text>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const style = (theme) => StyleSheet.create({
    pageBg: {
        paddingHorizontal: 16,
        flex: 1
    },
    scrollViewStyle: {
        flex: 1
    },
    topRowStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingBottom: 10,
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    privacyPolicyHeaderStyle: {
        fontSize: 24,
        fontWeight: '800',
        color: 'black',
        marginStart: 10
    },
    effectiveDateStyle: {
        fontSize: 14,
        fontWeight: '600',
        color: 'grey',
        marginTop: 10
    },
    contentHeaderRowStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 10
    },
    verticalLineStyle: {
        width: 5,
        height: 30,
        backgroundColor: 'purple'
    },
    contentHeaderTextStyle: {
        marginStart: 10,
        fontSize: 18,
        fontWeight: '800',
        color: 'black'
    },
    contentDescriptionStyle: {
        fontSize: 16,
        fontWeight: '400',
        color: 'black',
        marginTop: 10,
        lineHeight: 22
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

export default PrivacyPolicy;