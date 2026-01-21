import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Alert, TextInput, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePath from '../../../contexts/ImagePath';
import { moderateScale } from 'react-native-size-matters';
import Fonts from '../../../styles/GlobalFonts';
import { useTheme } from '../../../contexts/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { generateCode, generateCodeAndCreateRoom } from '../../../app/features/CreateRoomSlice';
import { getRoomDetailsThunk } from '../../../app/features/roomSlice';
import SliderContent from '../convoSpace/component/SliderContent';
import GlobalStyles from '../../../styles/GlobalStyles';
import { showMessage } from '../../../app/features/messageSlice';
import { getUserData } from '../../../units/asyncStorageManager';

const { width } = Dimensions.get('window');

const data = [
    {
        id: 1,
        title: 'Share Your Room Link',
        description:
            'Generate a unique join link and share it with others to start speaking together effortlessly.',
        image: ImagePath.convoImage,
    },
    {
        id: 2,
        title: 'Experience Real-Time Accent Conversion',
        description:
            'TalkBrush transforms voices in real time, helping you speak, learn, and enjoy different English accents naturally.',
        image: ImagePath.convoImage,
    },
    {
        id: 3,
        title: 'Start a Conversation Instantly',
        description:
            'Create a private room and practice English accents with friends, colleagues, or anyone you invite.',
        image: ImagePath.convoImage,
    },
];

const ConvoSpaceStart = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [roomCodeInput, setRoomCodeInput] = useState('');
    const [isJoiningRoom, setIsJoiningRoom] = useState(false);
    const [userRole, setUserRole] = useState(null);
    console.log(userRole, "👤 User Role");
    const swiperRef = useRef(null);
    const { theme } = useTheme();
    const styles = style(theme);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { room, code, loading, error } = useSelector(state => state.RoomSlices);

    // Load user role from AsyncStorage
    React.useEffect(() => {
        loadUserRole();
    }, []);

    const loadUserRole = async () => {
        try {
            const userData = await getUserData();
            if (userData && userData.user) {
                setUserRole(userData.user.type || userData.user.role);
            }
        } catch (error) {
            console.error('Error loading user role:', error);
        }
    };

    const startConversation = async () => {
        try {
            console.log("Starting conversation...");
            const response = await dispatch(generateCodeAndCreateRoom()).unwrap();
            console.log("API response:", response?.room?.room?.room_code);

            if (response?.room?.success === true) {
                const roomCode = response?.room?.room?.room_code;
                dispatch(
                    showMessage({
                        type: 'success',
                        text: response?.message || 'Room created successfully',
                    })
                );
                console.log("Navigating to ConvoSpaceTalk...");
                navigation.navigate('ConvoSpaceTalk', { roomCode });
                console.log("Navigating to ConvoSpaceTalk...");

            } else {
                console.log("API returned success:false");
            }

        } catch (error) {
            console.log("Catch error:", error);

            dispatch(
                showMessage({
                    type: 'error',
                    text: error?.message || "Room not created",
                })
            );
        }
    };

    const joinRoom = async () => {
        if (!roomCodeInput || roomCodeInput.trim() === '') {
            dispatch(
                showMessage({
                    type: 'error',
                    text: 'Please enter a valid room code',
                })
            );
            return;
        }

        const trimmedCode = roomCodeInput.trim();
        console.log("Validating room with code:", trimmedCode);

        try {
            setIsJoiningRoom(true);

            // Validate room exists by fetching room details
            const response = await dispatch(getRoomDetailsThunk(trimmedCode)).unwrap();

            if (response) {
                console.log("Room found:", response);

                dispatch(
                    showMessage({
                        type: 'success',
                        text: 'Room found! Joining...',
                    })
                );

                // Navigate to room
                navigation.navigate('ConvoSpaceTalk', { roomCode: trimmedCode });
                setRoomCodeInput('');
            } else {
                dispatch(
                    showMessage({
                        type: 'error',
                        text: 'Room not found. Please check the room code.',
                    })
                );
            }
        } catch (error) {
            console.log("Room validation error:", error);

            dispatch(
                showMessage({
                    type: 'error',
                    text: error?.message || 'Invalid room code. Please try again.',
                })
            );
        } finally {
            setIsJoiningRoom(false);
        }
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

                {/* Show Start Conversation only for admin (type 1) */}
            
                    <>
                        <TouchableOpacity style={styles.startConversationButton} onPress={startConversation}>
                            <MaterialIcons name="mic" color="white" size={20} />
                            <Text style={styles.startButtonText}>Start Conversation</Text>
                        </TouchableOpacity>

                        <View style={styles.orContainer}>
                            <View style={styles.orLine} />
                            <Text style={styles.orText}>OR</Text>
                            <View style={styles.orLine} />
                        </View>
                    </>
             

                <Text style={styles.joinRoomLabel}>
                  Join an existing room
                </Text>

                <View style={styles.joinRoomContainer}>
                    <TextInput
                        style={styles.roomCodeInput}
                        placeholder="Enter room code"
                        placeholderTextColor="grey"
                        value={roomCodeInput}
                        onChangeText={setRoomCodeInput}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!isJoiningRoom}
                    />
                    <TouchableOpacity
                        style={[styles.joinRoomButton, isJoiningRoom && styles.disabledButton]}
                        onPress={joinRoom}
                        disabled={isJoiningRoom}
                    >
                        {isJoiningRoom ? (
                            <>
                                <ActivityIndicator color="white" size="small" />
                                <Text style={styles.joinButtonText}>Validating...</Text>
                            </>
                        ) : (
                            <>
                                <MaterialIcons name="login" color="white" size={20} />
                                <Text style={styles.joinButtonText}>Join Room</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <Text style={styles.infoText}>
                    Discover how TalkBrush works
                </Text>
                {/* <View style={{width:GlobalStyles.windowWidth}}> */}
                <SliderContent data={data} />
                {/* </View> */}

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
            color: theme.subText,
        },
        startConversationButton: {
            flexDirection: 'row',
            backgroundColor: '#3B82F6',
            alignSelf: 'flex-start',
            paddingHorizontal: 20,
            marginTop: 20,
            alignItems: 'center',
            paddingVertical: 10,
            borderRadius: 8,
            gap: 8,
        },
        startButtonText: {
            color: 'white',
            paddingStart: 10,
            fontSize: moderateScale(14),
            fontFamily: Fonts.InterMedium,
        },
        orContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 30,
            marginBottom: 20,
        },
        orLine: {
            flex: 1,
            height: 1,
            backgroundColor: 'lightgrey',
        },
        orText: {
            color: theme.subText,
            paddingHorizontal: 15,
            fontSize: moderateScale(14),
            fontFamily: Fonts.InterMedium,
        },
        joinRoomLabel: {
            fontSize: moderateScale(18),
            fontFamily: Fonts.InterMedium,
            fontWeight: '600',
            color: theme.text,
                marginTop: 20,
            marginBottom: 10,
        },
        joinRoomContainer: {
            marginTop: 10,
        },
        roomCodeInput: {
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: 'lightgrey',
            borderRadius: 8,
            paddingHorizontal: 15,
            paddingVertical: 12,
            fontSize: moderateScale(14),
            fontFamily: Fonts.InterMedium,
            color: theme.text,
            marginBottom: 10,
        },
        joinRoomButton: {
            flexDirection: 'row',
            backgroundColor: '#3B82F6',
            alignSelf: 'flex-start',
            paddingHorizontal: 20,
            alignItems: 'center',
            paddingVertical: 10,
            borderRadius: 8,
            gap: 8,
        },
        disabledButton: {
            backgroundColor: '#9CA3AF',
            opacity: 0.7,
        },
        joinButtonText: {
            color: 'white',
            paddingStart: 10,
            fontSize: moderateScale(14),
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
