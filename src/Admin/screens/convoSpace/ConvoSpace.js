import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  PermissionsAndroid,
  Platform,
} from "react-native";
import Clipboard from '@react-native-clipboard/clipboard';
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import FontAwesome from "@react-native-vector-icons/fontawesome";
import { Dropdown } from "react-native-element-dropdown";
import { moderateScale } from "react-native-size-matters";
import io from "socket.io-client";
import { useDispatch } from "react-redux";
import { getRoomDetailsThunk } from "../../../app/features/roomSlice";
import Fonts from "../../../styles/GlobalFonts";
import Sound from 'react-native-nitro-sound';
import RNFS from "react-native-fs";
import { useTheme } from "../../../contexts/ThemeProvider";
import { getUserData } from "../../../units/asyncStorageManager";

const ConvoSpace = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const styles = style(theme);

  const BACKEND_URL = "https://talkbrush.com/accent";
  const roomCode = route.params?.roomCode || null;

  // Refs
  const socketRef = useRef(null);
  const recorderRef = useRef(null);
  const isMutedRef = useRef(true);
  const audioQueueRef = useRef([]);
  const isPlayingAudioRef = useRef(false);
  const recordingIntervalRef = useRef(null);
  const streamingSessionStartedRef = useRef(false);
  const isRecordingActiveRef = useRef(false);

  // State
  const [isListening, setIsListening] = useState(true);
  const [waveAnimation] = useState(new Animated.Value(0));
  const [currentAccent, setCurrentAccent] = useState("american");
  const [currentGender, setCurrentGender] = useState("male");
  const [handRaised, setHandRaised] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState({ sent: 0, received: 0, latency: 0 });
  const [roomDetails, setRoomDetails] = useState(null);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  console.log(participants)
  const ACCENT_OPTIONS = [
    { label: "American", value: "american" },
    { label: "British", value: "british" },
    { label: "Australian", value: "australian" },
    { label: "Indian", value: "indian" },
    { label: "Irish", value: "irish" },
    { label: "Portuguese", value: "portuguese" },
    { label: "Canadian", value: "canadian" },
    { label: "New Zealand", value: "new_zealand" },
    { label: "Nigerian", value: "nigerian" },
    { label: "Polish", value: "polish" },
    { label: "Russian", value: "russian" },
    { label: "German", value: "german" },
    { label: "Spanish", value: "spanish" },
    { label: "US – Midwest", value: "us_midwest" },
    { label: "US – New York", value: "us_new_york" },
  ];

  const GENDER_OPTIONS = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const NATURAL_PAUSE_MS = 450;

  // Load User Data from AsyncStorage
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedData = await getUserData();
      if (storedData && storedData.user) {
        const user = storedData.user;
        setUsername(user.username || user.name || 'Admin');
        setUserData({
          username: user.username || user.name || 'Admin',
          user_id: user._id || user.id,
          profile_image: user.profile_image || user.profileImage,
        });
      } else {
        setUsername('Admin');
        setUserData({
          username: 'Admin',
          user_id: 'admin_' + Date.now(),
        });
      }
      setIsLoadingUser(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      setUsername('Admin');
      setUserData({
        username: 'Admin',
        user_id: 'admin_' + Date.now(),
      });
      setIsLoadingUser(false);
    }
  };

  // Request Permissions
  useEffect(() => {
    requestPermissions();
  }, []);


  const requestPermissions = async () => {
    try {
      if (Platform.OS !== 'android') {
        setHasPermissions(true);
        return;
      }
      let permissions = [];
      if (Platform.Version >= 33) {
        permissions = [
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ];
      } else {
        permissions = [
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ];
      }
      const results = await PermissionsAndroid.requestMultiple(permissions);
      let allGranted = true;
      for (const permission of permissions) {
        if (results[permission] !== PermissionsAndroid.RESULTS.GRANTED) {
          allGranted = false;
          console.log(`${permission} denied`);
        }
      }
      if (!allGranted) {
        Alert.alert(
          "Permissions Required",
          "Microphone access is required to use voice chat. Please allow it in settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => PermissionsAndroid.openSettings?.() }
          ]
        );
      }
      setHasPermissions(allGranted);
      console.log("Permissions result:", allGranted ? "GRANTED" : "DENIED");
    } catch (err) {
      console.warn("Permission error:", err);
      setHasPermissions(false);
    }
  };


 

  useEffect(() => {
    if (!isListening) {
      Animated.loop(
        Animated.timing(waveAnimation, {
          toValue: 100,
          duration: 5000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [isListening]);

 

  // Socket.IO Connection


  useEffect(() => {
    if (!roomCode) {
      Alert.alert("Error", "No room code provided!");
      navigation.goBack();
      return;
    }

    console.log("✅ Connecting to:", BACKEND_URL);

    socketRef.current = io("https://talkbrush.com", {
      path: "/accent/socket.io/",
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
      forceNew: true,
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Connected - SID:", socketRef.current.id);
      setIsConnected(true);

      if (userData) {
        socketRef.current.emit("join_room", {
          room_code: roomCode,
          username: userData.username,
          user_id: userData.user_id,
        });
      }
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("❌ Disconnected:", reason);
      setIsConnected(false);
    });

    socketRef.current.on("reconnect", (attemptNumber) => {
      console.log("🔄 Reconnected after", attemptNumber, "attempts");
      setIsConnected(true);

      if (userData) {
        socketRef.current.emit("join_room", {
          room_code: roomCode,
          username: userData.username,
          user_id: userData.user_id,
        });
      }
    });

    socketRef.current.on("error", (data) => {
      console.error("Socket error:", data);
      Alert.alert("Error", data.message);
    });

    socketRef.current.on("user_joined", (data) => {
      console.log("👤 User joined:", data);
      setParticipants(data.participants || []);
    });

    socketRef.current.on("user_left", (data) => {
      console.log("👋 User left:", data.username);
      setParticipants(data.participants || []);
    });

    socketRef.current.on("mute_status_changed", (data) => {
      console.log("🔇 Mute status changed:", data);
      setParticipants(data.participants || []);
    });

    socketRef.current.on("hand_status_changed", (data) => {
      console.log("✋ Hand status changed:", data);
      setParticipants(data.participants || []);
    });

    socketRef.current.on("gender_changed", (data) => {
      console.log("👤 Gender changed:", data);
      setParticipants(data.participants || []);
    });

    socketRef.current.on("receive_audio", (data) => {
      const receiveTime = Date.now();
      console.log(`📥 Audio from: ${data.username}`);

      if (data.timestamp) {
        const endToEndLatency = receiveTime - data.timestamp;
        console.log(`⏱ E2E LATENCY: ${endToEndLatency}ms`);
      }

      data.receivedTime = receiveTime;
      setStats((prev) => ({ ...prev, received: prev.received + 1 }));
      queueAudio(data);
    });

    setupRecorder();

    return () => {
      cleanup();
    };
  }, [roomCode, username, navigation, isLoadingUser, userData]);

  const setupRecorder = async () => {
    try {
      if (!hasPermissions) {
        console.log('⚠️ Permissions not granted');
        return;
      }

      startStreamingRecording();
    } catch (error) {
      console.error('❌ Recorder setup failed:', error);
    }
  };

  const startStreamingRecording = () => {
    recordingIntervalRef.current = setInterval(async () => {
      if (!isMutedRef.current && hasPermissions && !isRecordingActiveRef.current) {
        try {
          if (!streamingSessionStartedRef.current) {
            socketRef.current.emit('start_streaming', {});
            streamingSessionStartedRef.current = true;
            console.log('▶️ Streaming session started');
          }

          isRecordingActiveRef.current = true;

          const audioPath = `${RNFS.CachesDirectoryPath}/audio_chunk_${Date.now()}.m4a`;
          const recorder = await Sound.create({ path: audioPath });

          await recorder.startRecording();

          setTimeout(async () => {
            try {
              await recorder.stopRecording();
              const base64Audio = await RNFS.readFile(audioPath, 'base64');

              if (base64Audio && base64Audio.length > 1000) {
                socketRef.current.emit('audio_stream_chunk', {
                  audio_data: base64Audio,
                  username: username,
                  accent: currentAccent,
                  timestamp: Date.now(),
                });
                setStats((prev) => ({ ...prev, sent: prev.sent + 1 }));
                console.log(`📤 Sent chunk: ${base64Audio.length} bytes`);
              }

              await RNFS.unlink(audioPath).catch(() => {});
              isRecordingActiveRef.current = false;
            } catch (err) {
              console.error('Recording error:', err);
              isRecordingActiveRef.current = false;
            }
          }, 200);

        } catch (err) {
          console.error('⚠️ Recording error:', err);
          isRecordingActiveRef.current = false;
        }
      } else if (isMutedRef.current && streamingSessionStartedRef.current) {
        socketRef.current.emit('stop_streaming');
        streamingSessionStartedRef.current = false;
        console.log('⏹️ Streaming session stopped');
      }
    }, 50);
  };

  const cleanup = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }

    if (recorderRef.current) {
      try {
        recorderRef.current.stopRecording();
      } catch (e) {}
    }

    if (socketRef.current) {
      socketRef.current.emit("leave_room", {
        room_code: roomCode,
        user_id: userData?.user_id
      });
      socketRef.current.off();
      socketRef.current.disconnect();
    }

    audioQueueRef.current = [];
    isPlayingAudioRef.current = false;
  };

  // Audio Queue System
  const queueAudio = (audioData) => {
    const queueTime = Date.now();
    audioQueueRef.current.push({ ...audioData, queueTime });
    console.log(`🔊 Queued at position ${audioQueueRef.current.length}`);

    if (!isPlayingAudioRef.current) {
      processAudioQueue();
    }
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const processAudioQueue = async () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingAudioRef.current = false;
      console.log("📭 Queue empty");
      return;
    }

    isPlayingAudioRef.current = true;
    const audioData = audioQueueRef.current.shift();

    try {
      const playStartTime = Date.now();
      await playAudioChunk(audioData);
      const playDuration = Date.now() - playStartTime;

      console.log(`🎵 Playback complete: ${playDuration}ms`);

      if (audioData.timestamp && audioData.receivedTime) {
        const latency = audioData.receivedTime - audioData.timestamp;
        setStats((prev) => ({
          ...prev,
          latency: Math.round(latency),
        }));
      }

      if (audioQueueRef.current.length > 0) {
        await sleep(NATURAL_PAUSE_MS);
      }

      processAudioQueue();
    } catch (error) {
      console.error("❌ Play error:", error);
      await sleep(NATURAL_PAUSE_MS);
      processAudioQueue();
    }
  };

  const playAudioChunk = async (audioData) => {
    try {
      console.log(`🎵 Playing audio from: ${audioData.username}`);

      const tempPath = `${RNFS.CachesDirectoryPath}/temp_audio_${Date.now()}.m4a`;
      await RNFS.writeFile(tempPath, audioData.audio_data, 'base64');

      const player = await Sound.create({ path: tempPath });
      await player.play();

      await new Promise((resolve) => {
        const checkInterval = setInterval(async () => {
          const isPlaying = await player.isPlaying();
          if (!isPlaying) {
            clearInterval(checkInterval);
            await RNFS.unlink(tempPath).catch(() => {});
            resolve();
          }
        }, 100);
      });

      console.log("✅ Playback done");
    } catch (err) {
      console.error("❌ Play audio error:", err);
    }
  };

  // Handlers
  const handleMicToggle = () => {
    const newMutedState = !isListening;
    setIsListening(newMutedState);
    isMutedRef.current = newMutedState;

    console.log(`🎤 ${newMutedState ? "MUTED" : "UNMUTED"}`);

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("toggle_mute", {
        user_id: userData?.user_id,
        muted: newMutedState
      });
    }
  };

  const handleEndCall = () => {
    console.log("📞 Ending call...");
    cleanup();
    navigation.goBack();
  };

  const handleShare = () => {
    const shareLink = `https://talkbrush.com/accent/room/${roomCode}`;
    Clipboard.setString(shareLink);
    Alert.alert("Success", "Room link copied to clipboard!");
  };

  const handleRaiseHand = () => {
    const newHandState = !handRaised;
    setHandRaised(newHandState);

    console.log(`✋ Hand ${newHandState ? "RAISED" : "LOWERED"}`);

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("raise_hand", {
        user_id: userData?.user_id,
        raised: newHandState
      });
    }
  };

  const handleAccentChange = (item) => {
    setCurrentAccent(item.value);
    console.log(`🗣️ Accent changed: ${item.value}`);

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("change_accent", {
        user_id: userData?.user_id,
        accent: item.value
      });
    }
  };

  const handleGenderChange = (item) => {
    setCurrentGender(item.value);
    console.log(`👤 Gender changed: ${item.value}`);

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("change_gender", {
        user_id: userData?.user_id,
        gender: item.value
      });
    }
  };

  const formatDateTime = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString("en-US", { month: "short" });
    const year = now.getFullYear();
    const time = now.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${day} ${month} ${year} | ${time}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.dropdownsContainer}>
              <Dropdown
                style={styles.dropdown}
                data={ACCENT_OPTIONS}
                labelField="label"
                valueField="value"
                placeholder="Select Accent"
                value={currentAccent}
                onChange={handleAccentChange}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownText}
                renderRightIcon={() => (
                  <MaterialIcons name="arrow-drop-down" size={24} color="black" />
                )}
              />
              <Dropdown
                style={styles.dropdown}
                data={GENDER_OPTIONS}
                labelField="label"
                valueField="value"
                placeholder="Select Gender"
                value={currentGender}
                onChange={handleGenderChange}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownText}
                renderRightIcon={() => (
                  <MaterialIcons name="arrow-drop-down" size={24} color="black" />
                )}
              />
            </View>
            <Text style={styles.dateTimeText}>{formatDateTime()}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Mia - Assistant Vocal</Text>
          <Text style={styles.subtitle}>
            Room: {roomCode} • {isConnected ? "🟢" : "🔴"} • {stats.latency}ms • ↑{stats.sent} ↓{stats.received}
          </Text>

          {/* Wave Animation */}
          <View style={styles.waveContainer}>
            <Animated.View
              style={[
                styles.waveLine,
                {
                  transform: [
                    {
                      translateY: waveAnimation.interpolate({
                        inputRange: [0, 100],
                        outputRange: [0, 20],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.waveLine,
                {
                  backgroundColor: "#A78BFA",
                  transform: [
                    {
                      translateY: waveAnimation.interpolate({
                        inputRange: [0, 100],
                        outputRange: [0, -15],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.waveLine,
                {
                  backgroundColor: "#F472B6",
                  transform: [
                    {
                      translateY: waveAnimation.interpolate({
                        inputRange: [0, 100],
                        outputRange: [0, 10],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>

          {/* Status */}
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              {isListening ? "Muted" : "Listening..."}
            </Text>
            {!isListening && <MaterialIcons name="mic" size={24} color="darkgoldenrod" />}
          </View>

          {isListening && (
            <Text style={styles.hintText}>
              You're muted — unmute yourself to speak.
            </Text>
          )}

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={handleMicToggle}
              style={[
                styles.actionButton,
                isListening ? styles.mutedButton : styles.unmutedButton,
              ]}
            >
              <MaterialIcons name="mic" size={24} color={isListening ? "white" : "black"} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <FontAwesome name="share" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRaiseHand}
              style={[
                styles.actionButton,
                handRaised && styles.handRaisedButton,
              ]}
            >
              <MaterialIcons name="back-hand" size={24} color={handRaised ? "white" : "black"} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleEndCall}
              style={[styles.actionButton, styles.endCallButton]}
            >
              <MaterialIcons name="call-end" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Participants */}
          <View style={styles.participantsContainer}>
            <Text style={styles.participantsTitle}>
              Participants ({participants.length})
            </Text>
            {participants.length === 0 ? (
              <Text style={styles.noParticipants}>Waiting for participants...</Text>
            ) : (
              participants.map((participant, index) => (
                <View key={participant.user_id || participant.sid || index} style={styles.participantCard}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {participant.username.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.participantInfo}>
                    <Text style={styles.participantName}>
                      {participant.username}
                      {(participant.user_id === roomDetails?.initiator_id || participant.sid === roomDetails?.initiator_id) && " (Host)"}
                      {participant.username === username && " (You)"}
                    </Text>
                    <View style={styles.badgeContainer}>
                      <Text style={styles.badge}>
                        {participant.muted ? "🔇" : "🔊"}
                      </Text>
                      {participant.hand_raised && <Text style={styles.badge}>✋</Text>}
                      <Text style={styles.badge}>🗣️ {participant.accent}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = (theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      padding: 20,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    dropdownsContainer: {
      flexDirection: "column",
      gap: 10,
      flex: 1,
      marginRight: 10,
    },
    dropdown: {
      width: "100%",
      height: 50,
      backgroundColor: "white",
      borderRadius: 10,
      paddingHorizontal: 15,
      elevation: 2,
    },
    dropdownPlaceholder: {
      fontSize: 12,
      color: "black",
    },
    dropdownText: {
      fontSize: 12,
      color: "black",
    },
    dateTimeText: {
      fontSize: moderateScale(12),
      color: theme.subText,
      fontFamily: Fonts.InterMedium,
    },
    title: {
      fontSize: moderateScale(28),
      fontFamily: Fonts.InterBold,
      color: theme.text,
      textAlign: "center",
      marginTop: 20,
    },
    subtitle: {
      fontSize: moderateScale(12),
      color: "grey",
      textAlign: "center",
      marginTop: 5,
    },
    waveContainer: {
      height: 150,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 30,
    },
    waveLine: {
      width: 200,
      height: 4,
      backgroundColor: "#38BDF8",
      borderRadius: 2,
      marginVertical: 5,
    },
    statusContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      marginBottom: 10,
    },
    statusText: {
      fontSize: moderateScale(24),
      fontFamily: Fonts.InterBold,
      color: theme.text,
    },
    hintText: {
      fontSize: moderateScale(12),
      color: "grey",
      textAlign: "center",
      marginBottom: 20,
    },
    actionsRow: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      marginVertical: 30,
    },
    actionButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
    },
    mutedButton: {
      backgroundColor: "#374151",
    },
    unmutedButton: {
      backgroundColor: "white",
    },
    handRaisedButton: {
      backgroundColor: "#EAB308",
    },
    endCallButton: {
      backgroundColor: "#EF4444",
    },
    participantsContainer: {
      marginTop: 20,
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
    },
    participantsTitle: {
      fontSize: moderateScale(18),
      fontFamily: Fonts.InterBold,
      marginBottom: 15,
      textAlign: "center",
    },
    noParticipants: {
      textAlign: "center",
      color: "grey",
      paddingVertical: 20,
    },
    participantCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F9FAFB",
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "#3B82F6",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
    },
    avatarText: {
      color: "white",
      fontSize: 20,
      fontFamily: Fonts.InterBold,
    },
    participantInfo: {
      flex: 1,
    },
    participantName: {
      fontSize: moderateScale(14),
      fontFamily: Fonts.InterMedium,
      marginBottom: 5,
    },
    badgeContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 5,
    },
    badge: {
      fontSize: 10,
      paddingHorizontal: 8,
      paddingVertical: 3,
      backgroundColor: "#E5E7EB",
      borderRadius: 5,
    },
  });

export default ConvoSpace;