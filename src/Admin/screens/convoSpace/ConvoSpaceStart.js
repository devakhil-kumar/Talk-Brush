import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import Swiper from 'react-native-swiper';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePath from '../../../contexts/ImagePath';
import { moderateScale } from 'react-native-size-matters';
import Fonts from '../../../styles/GlobalFonts';
import { useTheme } from '../../../contexts/ThemeProvider';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const data = [
    {
        id: 1,
        title: 'Obtén un vínculo para compartir',
        description:
            'Haz clic en Nueva reunión para obtener un vínculo que puedas enviar a las personas con quienes quieras reunirte',
        image: ImagePath.convoImage,
    },
    {
        id: 2,
        title: 'Obtén un vínculo para compartir',
        description:
            'Haz clic en Nueva reunión para obtener un vínculo que puedas enviar a las personas con quienes quieras reunirte',
        image: ImagePath.convoImage,
    },
    {
        id: 3,
        title: 'Obtén un vínculo para compartir',
        description:
            'Haz clic en Nueva reunión para obtener un vínculo que puedas enviar a las personas con quienes quieras reunirte',
        image: ImagePath.convoImage,
    },
];

const ConvoSpaceStart = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef(null);
    const { theme } = useTheme();
    const styles = style(theme);
    const navigation = useNavigation();

    const startConversation = () => {
        navigation.navigate('ConvoSpaceTalk');
    };

    return (
            <View style={styles.pageBg}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.headingText}>
                        Start Conversation with TalkBrush para todos.
                    </Text>

                    <Text style={styles.descriptionText}>
                        TalkBrush is an innovative app that lets users communicate in various accents. With TalkBrush, you can enhance your language skills while having fun chatting with people from around the globe. Discover the magic of linguistic diversity and connect with others through unique accents!
                    </Text>

                    <TouchableOpacity style={styles.startConversationButton} onPress={startConversation}>
                        <MaterialIcons name="mic" color="lightgrey" size={20} />
                        <Text style={styles.startButtonText}>Start Conversation</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.copyLinkButton}>
                        <MaterialIcons name="keyboard" color="grey" size={20} />
                        <Text style={styles.copyLinkText}>Copy the link and share</Text>
                    </TouchableOpacity>

                    <Text style={styles.infoText}>
                        más información <Text style={styles.inlineInfo}>sobre Talk Brush</Text>
                    </Text>

                    <View style={styles.swiperContainer}>
                        <TouchableOpacity
                            style={[styles.arrowButton, { marginTop: (width * 0.8) / 2 }]}
                            disabled={activeIndex === 0}
                            onPress={() => swiperRef.current.scrollBy(-1)}
                        >
                            <MaterialIcons
                                name="keyboard-arrow-left"
                                color={activeIndex === 0 ? 'grey' : 'black'}
                                size={28}
                            />
                        </TouchableOpacity>

                        <View style={styles.swiperWrapper}>
                            <Swiper
                                ref={swiperRef}
                                onIndexChanged={index => setActiveIndex(index)}
                                style={styles.swiper}
                                showsPagination={false}
                                loop={false}
                            >
                                {data.map(item => (
                                    <View key={item.id} style={styles.slideContainer}>
                                        <Image source={item.image} style={styles.slideImage} />
                                        <Text style={styles.slideTitle}>{item.title}</Text>
                                        <Text style={styles.slideDescription}>{item.description}</Text>
                                    </View>
                                ))}
                            </Swiper>

                            <View style={styles.paginationContainer}>
                                <View style={activeIndex === 0 ? styles.selectedDot : styles.dot} />
                                <View style={activeIndex === 1 ? styles.selectedDot : styles.dot} />
                                <View style={activeIndex === 2 ? styles.selectedDot : styles.dot} />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.arrowButton, { marginTop: (width * 0.8) / 2 }]}
                            disabled={activeIndex === data.length - 1}
                            onPress={() => swiperRef.current.scrollBy(1)}
                        >
                            <MaterialIcons
                                name="keyboard-arrow-right"
                                color={activeIndex === 2 ? 'grey' : 'black'}
                                size={28}
                            />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
    );
};

export default ConvoSpaceStart;

const style = theme =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
        },
        pageBg: {
            flex: 1,
            backgroundColor: theme.background,
            paddingHorizontal: 20,
        },
        scrollContainer: {
            paddingBottom: 0,
        },
        headingText: {
            width: '80%',
            fontSize: moderateScale(26),
            fontFamily: Fonts.InterBold,
            color: theme.text,
        },
        descriptionText: {
            marginTop: 20,
            fontSize: moderateScale(16),
            fontFamily: Fonts.InterMedium,
            color: 'grey',
        },
        startConversationButton: {
            flexDirection: 'row',
            backgroundColor: theme.secandprimary,
            alignSelf: 'flex-start',
            paddingHorizontal: 20,
            marginTop: 20,
            alignItems: 'center',
            paddingVertical: 8,
            borderRadius: 5,
        },
        startButtonText: {
            color: 'lightgrey',
            paddingStart: 10,
            fontSize: moderateScale(12),
            fontFamily: Fonts.InterMedium,
        },
        copyLinkButton: {
            flexDirection: 'row',
            paddingHorizontal: 20,
            marginTop: 10,
            alignItems: 'center',
            justifyContent: 'space-evenly',
            borderWidth: 1,
            borderColor: 'grey',
            minWidth: 150,
            alignSelf: 'flex-start',
            paddingVertical: 8,
            borderRadius: 5,
        },
        copyLinkText: {
            color: 'grey',
            paddingStart: 10,
            fontSize: moderateScale(12),
            fontFamily: Fonts.InterMedium,
        },
        infoText: {
            color: 'blue',
            marginTop: 20,
            fontSize: moderateScale(16),
            fontFamily: Fonts.InterMedium,
        },
        inlineInfo: {
            color: theme.subText,
            fontFamily: Fonts.InterMedium,
        },
        swiperContainer: {
            flexDirection: 'row',
            marginTop: 30,
            justifyContent: 'center',
        },
        arrowButton: {
            // dynamic marginTop remains inline in component
        },
        swiperWrapper: {
            width: width * 0.75,
        },
        swiper: {
            height: width * 1.3,
        },
        slideContainer: {
            minHeight: 100,
        },
        slideImage: {
            width: width * 0.7,
            height: width * 0.8,
            borderWidth: 3,
            borderColor: 'deepskyblue',
            borderRadius: 500,
            alignSelf: 'center',
        },
        slideTitle: {
            textAlign: 'center',
            marginTop: 10,
            fontSize: moderateScale(26),
            fontFamily: Fonts.InterBold,
            color: theme.text,
        },
        slideDescription: {
            textAlign: 'center',
            marginTop: 10,
            fontSize: moderateScale(16),
            color: 'grey',
            fontFamily: Fonts.InterMedium,
        },
        paginationContainer: {
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 10,
        },
        dot: {
            width: 5,
            height: 5,
            backgroundColor: 'grey',
            borderRadius: 40,
            marginHorizontal: 10,
        },
        selectedDot: {
            width: 5,
            height: 5,
            backgroundColor: 'blue',
            borderRadius: 40,
            marginHorizontal: 10,
        },
    });
