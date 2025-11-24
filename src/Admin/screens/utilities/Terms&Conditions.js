import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../contexts/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import Fonts from '../../../styles/GlobalFonts';
import Feather from '@react-native-vector-icons/feather';

const TermsAndConditions = () => {
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
                    <Text style={styles.headerTitle}>Terms and Conditions</Text>
                    <View style={{ width: 24 }} />
                </View>
                <ScrollView
                    style={styles.scrollViewStyle}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.topRowStyle}>
                        <MaterialIcons
                            name="feed"
                            size={35}
                            color="lightseagreen"
                        />
                        <Text style={styles.termsAndConditionsHeaderStyle}>Terms and Conditions</Text>
                    </View>
                    <Text style={styles.effectiveDateStyle}>Last updated: November 20, 2025</Text>

                    <View>
                        <View style={styles.contentHeaderRowStyle}>
                            <View style={styles.verticalLineStyle} />
                            <Text style={styles.contentHeaderTextStyle}>1. Agreement to Terms</Text>
                        </View>
                        <Text style={styles.contentDescriptionStyle}>By accessing or using our service, you agree to be bound by these Terms and Conditions and all policies incorporated by reference. If you do not agree to all of these terms, do not use our service.</Text>
                    </View>

                    <View >
                        <View style={styles.contentHeaderRowStyle}>
                            <View style={styles.verticalLineStyle} />
                            <Text style={styles.contentHeaderTextStyle}>2. Changes to Terms</Text>
                        </View>
                        <Text style={styles.contentDescriptionStyle}>We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.</Text>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <View style={styles.contentHeaderRowStyle}>
                            <View style={styles.verticalLineStyle} />
                            <Text style={styles.contentHeaderTextStyle}>3. User Obligations</Text>
                        </View>
                        <Text style={styles.contentDescriptionStyle}>You agree not to use the service for any purpose that is unlawful or prohibited by these Terms. This includes, but is not limited to, unauthorized commercial communications, posting malicious code, or harassing other users.</Text>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <View style={styles.contentHeaderRowStyle}>
                            <View style={styles.verticalLineStyle} />
                            <Text style={styles.contentHeaderTextStyle}>4. Limitation of Liability</Text>
                        </View>
                        <Text style={styles.contentDescriptionStyle}>The service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the operation of the service or the information, content, or materials included therein. To the fullest extent permissible by applicable law, we disclaim all warranties.</Text>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <View style={styles.contentHeaderRowStyle}>
                            <View style={styles.verticalLineStyle} />
                            <Text style={styles.contentHeaderTextStyle}>5. Governing Law</Text>
                        </View>
                        <Text style={styles.contentDescriptionStyle}>These Terms shall be governed and construed in accordance with the laws of the jurisdiction where the company is headquartered, without regard to its conflict of law provisions.</Text>
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
    termsAndConditionsHeaderStyle: {
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
        backgroundColor: 'lightseagreen'
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

export default TermsAndConditions;