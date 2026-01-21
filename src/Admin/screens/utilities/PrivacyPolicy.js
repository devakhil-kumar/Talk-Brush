import React from 'react';
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

    // Helper component to render sections cleanly without repeating code
    const Section = ({ title, children }) => (
        <View style={{ marginTop: 20 }}>
            <View style={styles.contentHeaderRowStyle}>
                <View style={styles.verticalLineStyle} />
                <Text style={styles.contentHeaderTextStyle}>{title}</Text>
            </View>
            <View>
                {children}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name='chevron-left' color={theme.text} size={25} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.pageBg}>
                <ScrollView
                    style={styles.scrollViewStyle}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 50 }}
                >

                    <Text style={styles.contentHeaderTextStyle}>Last Updated: 18 December 2025 </Text>
                    <Text style={styles.contentDescriptionStyle}>Welcome to TALKBrush, an accent adapter and virtual meeting platform. TALKBrush is an app developed and operated by SMART NEURO DILIGENCE. For privacy purposes, TALKBrush is responsible for the collection and handling of your data in accordance with this policy. </Text>
                    <Text style={styles.contentDescriptionStyle}>TALKBrush complies with the Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth) for the collection, use, disclosure, and storage of personal information. We are also committed to fulfilling applicable obligations under Apple and Google Play’s app store privacy requirements, ensuring a safe, transparent experience as you use our services. </Text>
                    <Text style={styles.contentDescriptionStyle}>This document outlines our Privacy Policy and Terms of Service ("Terms"). By accessing or using TALKBrush, you agree to be bound by these Terms.  </Text>
                    <Text style={[styles.contentHeaderTextStyle, { marginTop: 10 }]}>Table of Contents </Text>
                    <Text style={styles.contentDescriptionStyle}>
                        1{")."} Information We Collect{"\n"}
                        2{")."} Legal Basis for Data Processing{"\n"}
                        3{")."} How We Use Your Information{"\n"}
                        4{")."} Profile Photos{"\n"}
                        5{")."} Microphone Access{"\n"}
                        6{")."} Third-Party Services{"\n"}
                        7{")."} International Data Transfer{"\n"}
                        8{")."} Data Access and Sharing{"\n"}
                        9{")."} Data Security{"\n"}
                        10{")."} Data Retention and Deletion{"\n"}
                        11{")."} Data Breach Notification{"\n"}
                        12{")."} Your Rights{"\n"}
                        13{")."} Children’s Privacy and Eligibility{"\n"}
                        14{")."} User Responsibilities{"\n"}
                        15{")."} Termination{"\n"}
                        16{")."} Intellectual Property{"\n"}
                        17{")."} Limitation of Liability{"\n"}
                        18{")."} Governing Law{"\n"}
                        19{")."} Changes to This Policy{"\n"}
                        20{")."} Disclaimer{"\n"}
                        21{")."} Contact Us{"\n"}
                    </Text>
                    {/* Title & Date */}
                    <View style={styles.topRowStyle}>
                        <MaterialIcons
                            name="privacy-tip"
                            size={35}
                            color="purple"
                        />
                        <Text style={styles.privacyPolicyHeaderStyle}>Privacy Policy</Text>
                    </View>
                    <Text style={styles.effectiveDateStyle}>Effective Date: November 15, 2025</Text>

                    {/* --- EXISTING SECTIONS (1-6) --- */}

                    <Section title="1. Information We Collect">
                        <Text style={styles.contentDescriptionStyle}>When you create an account with TALKBrush, we collect the following personal information:</Text>
                        <Text style={styles.contentDescriptionStyle}>{"\n"}
                            a{")."} Name{"\n"}
                            b{")."} Email address{"\n"}
                            c{")."} Mobile number (optional){"\n"}
                            d{")."} Home suburb (optional){"\n"}
                            e{")."} Company/organization you attend{"\n"}
                            {"\n"}
                            If you use our audio or profile features, we may also request access to your device's microphone, camera, or photo library.{"\n"}
                            We may also collect limited device and usage information (e.g., IP address, app version, crash logs) to improve app functionality.
                        </Text>
                    </Section>

                    <Section title="2. Legal Basis for Data Processing">
                        <Text style={styles.contentDescriptionStyle}>{"\n"}We process your personal information based on the following legal grounds:{"\n"}
                            {"\n"} a{")."} Consent: We rely on your consent to collect optional or sensitive data (microphone, camera). You can withdraw this at any time.{"\n"}
                            b{")."} Legitimate Interest: To improve app performance, analyze engagement, and ensure security.{"\n"}
                            c{")."} Contract Fulfilment: To provide core translation services and manage your account.
                        </Text>
                    </Section>

                    <Section title="3. How We Use Your Information">
                        <Text style={styles.contentDescriptionStyle}>{"\n"}We use your information to:{"\n"}
                            {"\n"} a{")."} Provide live translation services.{"\n"}
                            b{")."} Enable profile management.{"\n"}
                            c{")."} Monitor app usage trends and KPIs.{"\n"}
                            d{")."} Improve functionality and user experience.{"\n"}
                            {"\n"}We do not use your data for third-party advertising or sell your personal information.
                        </Text>
                    </Section>

                    <Section title="4. Profile Photos">
                        <Text style={styles.contentDescriptionStyle}>If you choose to upload a profile photo, we may request access to your Camera or Photo Library. Adding a photo is optional and used only within your profile. It is not shared for marketing.</Text>
                    </Section>

                    <Section title="5. Microphone Access">
                        <Text style={styles.contentDescriptionStyle}>Microphone access is required for real-time translation. Access is only used during active sessions. Audio is not recorded or stored beyond what is necessary for immediate translation.</Text>
                    </Section>

                    <Section title="6. Third-Party Services">
                        <Text style={styles.contentDescriptionStyle}>
                            a{")."} MongoDB Atlas (AWS) – Database services (Sydney, Australia).{"\n"}
                            b{")."} Microsoft Azure – Core application servers (Melbourne, Australia).{"\n"}
                            {"\n"}We do not share personal info with these providers for marketing.
                        </Text>
                    </Section>

                    {/* --- NEW SECTIONS (7-21) --- */}

                    <Section title="7. International Data Transfer">
                        <Text style={styles.contentDescriptionStyle}>
                            All personal data collected through the TALKBrush app is stored and managed on servers located within Australia (see “Section 6. Third-Party Services” for more details).
                            {"\n\n"}
                            While we do not store or process data on servers located outside Australia, users accessing the app from overseas may transmit data to our Australian servers. This means that cross-border data transfers may occur when international users interact with the app.
                            {"\n\n"}
                            We ensure that all such transfers are handled securely, using encrypted transmission protocols (e.g., TLS 1.2+) to protect your information as it is sent to our servers in compliance with applicable privacy laws.
                        </Text>
                    </Section>

                    <Section title="8. Data Access and Sharing">
                        <Text style={styles.contentDescriptionStyle}>Your data is accessible only to:</Text>
                        <Text style={styles.contentDescriptionStyle}>
                            ● Authorised TALKBrush staff and contractors who require access to deliver or improve the service.{"\n"}
                            ● Trusted third-party service providers (such as cloud hosting, payment processing, or analytics services) strictly for operational purposes.
                        </Text>
                        <Text style={styles.contentDescriptionStyle}>
                            All access to data is governed by strict confidentiality agreements and secured through appropriate technical and organisational measures.
                        </Text>
                    </Section>

                    <Section title="9. Data Security">
                        <Text style={styles.contentDescriptionStyle}>We use industry-standard technical and organisational safeguards, including:</Text>
                        <Text style={styles.contentDescriptionStyle}>
                            ● TLS 1.2+ and SSL encryption for secure data transmission{"\n"}
                            ● Data encryption at rest and in transit{"\n"}
                            ● Role-based access control to limit internal data access{"\n"}
                            ● Regular secure backups{"\n"}
                            ● Authentication protocols to protect user accounts
                        </Text>
                        <Text style={styles.contentDescriptionStyle}>
                            We continually assess and upgrade our security to match best practices; however, we are unable to guarantee absolute protection of data and metrics. TALKBrush cannot accept responsibility for the security or information you send to or receive from us over the Internet, or for any unauthorised access or use of that information.
                        </Text>
                    </Section>

                    <Section title="10. Data Retention and Deletion">
                        <Text style={styles.contentDescriptionStyle}>We retain your personal data only for as long as necessary for its intended purpose. You may delete your account by:</Text>
                        <Text style={styles.contentDescriptionStyle}>
                            <Text style={{ fontWeight: 'bold' }}>Option 1: In-App</Text>{"\n"}
                            ● Go to Settings {'>'} Account {'>'} Delete Account
                        </Text>
                        <Text style={styles.contentDescriptionStyle}>
                            <Text style={{ fontWeight: 'bold' }}>Option 2: By Email</Text>{"\n"}
                            ● Send a request to lnfo@talkbrush.com{"\n"}
                            ● Include your full name and registered email
                        </Text>
                        <Text style={styles.contentDescriptionStyle}>
                            Your data will be deleted within 30 days unless we are legally required to retain it for a longer period.
                        </Text>
                    </Section>

                    <Section title="11. Data Breach Notification">
                        <Text style={styles.contentDescriptionStyle}>
                            In the event of a data breach which is considered likely to result in serious harm, we will notify affected users and the Office of the Australian Information Commissioner (OAIC) in accordance with the Notifiable Data Breaches (NDB) scheme.
                        </Text>
                    </Section>

                    <Section title="12. Your Rights">
                        <Text style={styles.contentDescriptionStyle}>You have the right to:</Text>
                        <Text style={styles.contentDescriptionStyle}>
                            ● Access and correct your personal data{"\n"}
                            ● Request deletion of your account and personal data{"\n"}
                            ● Withdraw consent to data collection (e.g., camera, microphone){"\n"}
                            ● Lodge a complaint with the OAIC if you believe your data has been mishandled
                        </Text>
                    </Section>

                    <Section title="13. Children's Privacy and Eligibility">
                        <Text style={styles.contentDescriptionStyle}>
                            You must be at least 13 years old to use the app. Users under 18 must have parental or guardian consent. We do not knowingly collect data from children under 13. If we become aware of such data collection, we will prioritise deleting the information from our server.
                        </Text>
                    </Section>

                    <Section title="14. User Responsibilities">
                        <Text style={styles.contentDescriptionStyle}>You agree to:</Text>
                        <Text style={styles.contentDescriptionStyle}>
                            ● Provide accurate and truthful information during sign-up{"\n"}
                            ● Use the app only for lawful purposes and in accordance with these Terms{"\n"}
                            ● Keep your login credentials secure.
                        </Text>
                    </Section>

                    <Section title="15. Termination">
                        <Text style={styles.contentDescriptionStyle}>We may suspend or terminate your account if:</Text>
                        <Text style={styles.contentDescriptionStyle}>
                            ● You breach these Terms{"\n"}
                            ● You misuse the services{"\n"}
                            ● Termination is required for legal or security reasons
                        </Text>
                        <Text style={styles.contentDescriptionStyle}>
                            If we suspend or terminate your account, it will be deleted from our servers. You may also delete your account at any time by contacting support or using the in-app settings.
                        </Text>
                    </Section>

                    <Section title="16. Intellectual Property">
                        <Text style={styles.contentDescriptionStyle}>
                            TALKBrush and its contents are the property of SMART NEURO DILIGENCE. All rights reserved. You may not copy, modify, or distribute any part of the app without written consent.
                        </Text>
                    </Section>

                    <Section title="17. Limitation of Liability">
                        <Text style={styles.contentDescriptionStyle}>
                            To the fullest extent permitted by law, SMART NEURO DILIGENCE, its staff, and app developers are not liable for indirect, incidental, or consequential damages arising from app use.
                        </Text>
                    </Section>

                    <Section title="18. Governing Law">
                        <Text style={styles.contentDescriptionStyle}>
                            These Terms are governed by the laws of South Australia, Australia. Disputes will be handled under the jurisdiction of South Australian courts.
                        </Text>
                    </Section>

                    <Section title="19. Changes to This Policy">
                        <Text style={styles.contentDescriptionStyle}>
                            We may revise these Terms and Privacy Policy from time to time. We will notify you of significant changes via the app or email, and the amended version will be made available on our website at https://talkbrush.com/privacy-policy
                            {"\n\n"}
                            Continued use of TALKBrush following notification of such changes will be taken as acceptance of the updated Terms.
                        </Text>
                    </Section>

                    <Section title="20. Disclaimer">
                        <Text style={styles.contentDescriptionStyle}>
                            TALKBrush is provided “as is” and “as available”. We do not guarantee uninterrupted service or completely accurate translations.
                        </Text>
                    </Section>

                    <Section title="21. Contact Us">
                        <Text style={styles.contentDescriptionStyle}>
                            If you have any questions, requests, or concerns regarding these Terms or our Privacy Policy, please contact us at:
                            {"\n\n"}
                            Email: info@talkbrush.com
                        </Text>
                    </Section>

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
        borderBottomColor: theme.text, // Changed from black for dark mode
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop: 10
    },
    privacyPolicyHeaderStyle: {
        fontSize: 24,
        fontWeight: '800',
        color: theme.text,
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
        backgroundColor: 'purple',
        borderRadius: 2
    },
    contentHeaderTextStyle: {
        marginStart: 10,
        fontSize: 18,
        fontWeight: '800',
        color: theme.text
    },
    contentDescriptionStyle: {
        fontSize: 16,
        fontWeight: '400',
        color: theme.text,
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
        paddingHorizontal: 16
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: Fonts.InterBold,
        color: theme.text,
    }
});

export default PrivacyPolicy;