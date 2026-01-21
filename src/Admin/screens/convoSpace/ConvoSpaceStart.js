import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Alert } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePath from '../../../contexts/ImagePath';
import { moderateScale } from 'react-native-size-matters';
import Fonts from '../../../styles/GlobalFonts';
import { useTheme } from '../../../contexts/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { generateCode, generateCodeAndCreateRoom } from '../../../app/features/CreateRoomSlice';
import SliderContent from '../convoSpace/component/SliderContent';
import GlobalStyles from '../../../styles/GlobalStyles';
import { showMessage } from '../../../app/features/messageSlice';
import { TextInput } from 'react-native-gesture-handler';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { getRoomInfoDetailsThunk, joinRoomThunk } from '../../../app/features/roomDetailsSlice';
import RoomInviteModal from './component/RoomInviteModal';

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
    const swiperRef = useRef(null);
    const { theme } = useTheme();
    const styles = style(theme);
    const navigation = useNavigation();
    const [joincode, setJoinCode] = useState();
    const dispatch = useDispatch();
    const { room, code, loading, error } = useSelector(state => state.RoomSlices);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [roomDetails, setRoomDetails] = useState(null);
    const [isJoining, setIsJoining] = useState(false)
    const [checkRoom, setCheckRoom] = useState(false);
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);




    const startConversation = async () => {
        if (isCreatingRoom) return;
        setIsCreatingRoom(true);
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
        } finally {
            setIsCreatingRoom(false);
        }
    };

    const handleJoinRoom = async () => {
        // const trimmedCode = code.trim();
        console.log(joincode, 'code+++++++++++')
        if (!joincode || joincode.length !== 8) {
            Alert.alert('Please enter a valid 8-character room code');
            return;
        }
        setCheckRoom(true)
        try {
            const result = await dispatch(getRoomInfoDetailsThunk(joincode));
            console.log(result, 'result=====')
            if (getRoomInfoDetailsThunk.fulfilled.match(result)) {
                setRoomDetails(result.payload);
                setIsModalVisible(true);
            } else {
                Alert.alert('Room are not found. Please check the room code and try again.');
                setJoinCode('');
            }
        } catch (error) {
            console.error('Error joining room:', error);
            Alert.alert('Room not found. Please check the room code and try again.');
            setJoinCode('');
        } finally {
            setCheckRoom(false)
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setRoomDetails(null);
    };

    const handleJoinRoomFromModal = async () => {
        if (!joincode) {
            Alert.alert('Error', 'Room code is missing');
            return;
        }
        console.log(joincode, 'joincode')
        setIsJoining(true);
        try {
            const result = await dispatch(joinRoomThunk(joincode)).unwrap();
            console.log("Join room response:", result);
            setIsModalVisible(false);
            dispatch(
                showMessage({
                    type: 'success',
                    text: 'Successfully joined the room!',
                })
            );
            navigation.navigate('ConvoSpaceTalk', { roomCode: joincode });
            setJoinCode('');
        } catch (error) {
            console.error('Error joining room from modal:', error);
            const errormessage = error;
            dispatch(
                showMessage({
                    type: 'error',
                    text: errormessage || 'Failed to join room. Please try again.',
                })
            );
        } finally {
            setIsJoining(false);
        }
    };


    return (
        <View style={styles.pageBg}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.headingText}>
                    Start Conversation with TalkBrush everyone, everywhere.
                </Text>

                <Text style={styles.descriptionText}>
                    TalkBrush is an innovative app that lets users communicate in various accents. With TalkBrush, you can enhance your language skills while having fun chatting with people from around the globe. Discover the magic of linguistic diversity and connect with others through unique accents!
                </Text>

                <TouchableOpacity style={styles.startConversationButton} onPress={startConversation}>
                    <MaterialIcons name="mic" color="lightgrey" size={20} />
                    <Text style={styles.startButtonText}>{isCreatingRoom ? 'Wait...' : 'Start Conversation'}</Text>
                </TouchableOpacity>
                <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TextInput
                        style={{ width: '50%', borderWidth: 1, borderColor: theme.subText, borderRadius: 5, padding: 10 }}
                        placeholder='Enter Room Code'
                        value={joincode}
                        onChangeText={setJoinCode}
                        placeholderTextColor={'gray'}
                    />
                    <TouchableOpacity style={[styles.startConversationButton, { backgroundColor: "#519377", marginTop: 4 }]} onPress={handleJoinRoom}>
                        <FontAwesome name="chain" color="#fff" size={20} />
                        <Text style={styles.startButtonText}>{checkRoom ? "Wait..." : "Join Room"}</Text>
                    </TouchableOpacity>
                </View>


                {/* <TouchableOpacity style={styles.copyLinkButton}>
                        <MaterialIcons name="keyboard" color="grey" size={20} />
                        <Text style={styles.copyLinkText}>Copy the link and share</Text>
                    </TouchableOpacity> */}

                <Text style={styles.infoText}>
                    Discover how TalkBrush works
                </Text>
                {/* <View style={{width:GlobalStyles.windowWidth}}> */}
                <SliderContent data={data} />
                {/* </View> */}

            </ScrollView>

            <RoomInviteModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                roomData={roomDetails}
                onJoinRoom={handleJoinRoomFromModal}
                isJoining={isJoining}
            />
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
            // backgroundColor: theme.background,
            paddingHorizontal: 20,
        },
        scrollContainer: {
            paddingBottom: 0,
        },
        headingText: {
            width: '94%',
            fontSize: moderateScale(26),
            fontFamily: Fonts.InterBold,
            color: theme.text,
            marginTop:10
        },
        descriptionText: {
            marginTop: 20,
            fontSize: moderateScale(16),
            fontFamily: Fonts.InterMedium,
            color: theme.subText,
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
            color: '#fff',
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