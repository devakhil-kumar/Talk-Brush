import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Clipboard,
  Animated,
  PermissionsAndroid,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import FontAwesome from "@react-native-vector-icons/fontawesome";
import { Dropdown } from "react-native-element-dropdown";
import { moderateScale } from "react-native-size-matters";
import io from "socket.io-client";
import { useDispatch } from "react-redux";

// ✅ 1. RECORDING (Sending Raw PCM)
import LiveAudioStream from 'react-native-live-audio-stream';

// ✅ 2. PLAYBACK
import Sound from 'react-native-nitro-sound';
import RNFS from "react-native-fs";

import { useTheme } from "../../../contexts/ThemeProvider";
import { showMessage } from "../../../app/features/messageSlice";
import { getRoomInfoDetailsThunk } from "../../../app/features/roomDetailsSlice";
import Fonts from "../../../styles/GlobalFonts";
import { getUserData } from "../../../units/asyncStorageManager";
import VoiceWaveAnimation from './component/WaveAnimation';

const ConvoSpace = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const styles = style(theme);

  const roomCode = route.params?.roomCode || null;

  // 🔥 CONSTANT: Audio Options (Defined outside for reuse)
  const audioOptions = {
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    audioSource: 6, // Voice Recognition Source
    bufferSize: 1024 // Low latency
  };

  // Refs
  const socketRef = useRef(null);
  const isMutedRef = useRef(true);

  // Audio Queue
  const audioQueueRef = useRef([]);
  const isPlayingAudioRef = useRef(false);
  const recentlyPlayedRef = useRef([]);
  const audioSubscriptionRef = useRef(null);

  const streamingSessionStartedRef = useRef(false);
  const hasJoinedRoomRef = useRef(false);
  const userProfilesRef = useRef({});

  // Stats Ref
  const statsRef = useRef({ sent: 0, received: 0, latency: 0 });

  // State
  const [isListening, setIsListening] = useState(true); // UI Mute State (true = Muted)
  const [waveAnimation] = useState(new Animated.Value(0));
  const [currentAccent, setCurrentAccent] = useState("american");
  const [handRaised, setHandRaised] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [roomDetails, setRoomDetails] = useState(null);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  // UI Stats
  const [uiStats, setUiStats] = useState({ sent: 0, received: 0, latency: 0 });

  // 🔥 Reduced natural pause for faster playback feeling
  const NATURAL_PAUSE_MS = 10;
  const DUPLICATE_WINDOW_MS = 10000;

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

  // ==========================================
  // 1. INITIALIZATION (Audio Permissions & Setup)
  // ==========================================
  useEffect(() => {
    const setupAudio = async () => {
      let hasPerm = false;

      // 1. Request Permission
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            hasPerm = true;
            setHasPermissions(true);
          }
        } catch (err) {
          console.warn("Permission Error:", err);
        }
      } else {
        hasPerm = true;
        setHasPermissions(true);
      }

      // 2. Init Audio Stream ONLY after permission
      if (hasPerm) {
        console.log("🎤 Initializing Audio Stream...");
        try {
          LiveAudioStream.init(audioOptions);
        } catch (e) {
          console.log("Audio Init Error (Ignored if already initialized):", e);
        }
      }
    };

    setupAudio();

    return () => {
      try {
        LiveAudioStream.stop();
      } catch (e) { }
    };
  }, []);

  // UI Throttler for Stats
  useEffect(() => {
    const interval = setInterval(() => {
      setUiStats((prev) => {
        if (
          prev.sent !== statsRef.current.sent ||
          prev.received !== statsRef.current.received ||
          prev.latency !== statsRef.current.latency
        ) {
          return { ...statsRef.current };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  // ==========================================
  // 2. DATA LOADING (User & Room) - Safe Logic
  // ==========================================
  useEffect(() => {
    const loadData = async () => {
      if (!roomCode) return;

      // 1. Get User from Storage
      let currentUserId = null;
      let currentUsername = "Guest_" + Math.random().toString(36).substr(2, 6);

      try {
        const storedUserData = await getUserData('user');
        if (storedUserData) {
          const parsed = typeof storedUserData === 'string' ? JSON.parse(storedUserData) : storedUserData;
          currentUserId = parsed?.user?.id || parsed?.id;
          currentUsername = parsed?.user?.fullName || parsed?.name || currentUsername;
        }
      } catch (e) {
        console.log("Storage error", e);
      }

      setUsername(currentUsername);

      // 2. 🔥 Set UserData immediately (Don't wait for API)
      const initialUserData = {
        username: currentUsername,
        user_id: currentUserId || "guest_" + Date.now()
      };
      setUserData(initialUserData);

      // 3. Fetch Room Details
      try {
        const response = await dispatch(getRoomInfoDetailsThunk(roomCode)).unwrap();
        setRoomDetails(response);

        // Update UserData if found in room
        const userInRoom = response.members.find(m => String(m.user_id) === String(currentUserId));
        if (userInRoom) {
          setUserData({
            username: userInRoom.username,
            user_id: userInRoom.user_id
          });
          setUsername(userInRoom.username);
        }

        // Build Participants List
        response.members.forEach(m => userProfilesRef.current[m.user_id] = m.profile_image);
        let participantsList = response.members.map(m => ({
          username: m.username,
          sid: m.user_id,
          profile_image: m.profile_image,
          muted: true,
          hand_raised: false,
          accent: 'american',
          gender: 'male'
        }));

        // Add self if not in list
        const isUserInList = participantsList.some(p => String(p.sid) === String(initialUserData.user_id));
        if (!isUserInList) {
          participantsList.push({
            username: initialUserData.username,
            sid: initialUserData.user_id,
            profile_image: null,
            muted: true,
            hand_raised: false,
            accent: 'american',
            gender: 'male'
          });
        }
        setParticipants(participantsList);

      } catch (error) {
        console.error("Error loading room API:", error);
        // Fallback participant list
        setParticipants([{
          username: initialUserData.username,
          sid: initialUserData.user_id,
          profile_image: null,
          muted: true,
          hand_raised: false,
          accent: 'american',
          gender: 'male'
        }]);
      }
    };
    loadData();
  }, [dispatch, roomCode]);


  // ==========================================
  // 3. SOCKET CONNECTION (Independent)
  // ==========================================
  useEffect(() => {
    if (!roomCode) {
      Alert.alert("Error", "No room code provided!");
      navigation.goBack();
      return;
    }

    // Connect Socket
    socketRef.current = io("https://talkbrush.com", {
      path: "/accent/socket.io/",
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Socket Connected! ID:', socketRef.current.id);
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ Socket Disconnected');
      setIsConnected(false);
      hasJoinedRoomRef.current = false;
    });

    // Event Listeners
    socketRef.current.on('user_joined', (data) => {
      // Optional: Refresh room details logic
      console.log("User Joined:", data.username);
    });

    socketRef.current.on('user_left', (data) => {
      const leftId = data.user_id || data.sid;
      setParticipants(prev => prev.filter(p => p.sid !== leftId));
    });

    socketRef.current.on('mute_status_changed', (data) => {
      setParticipants(prev => prev.map(p => {
        const match = data.participants?.find(x => String(x.user_id) === String(p.sid));
        return match ? { ...p, muted: match.muted } : p;
      }));
    });

    socketRef.current.on('hand_status_changed', (data) => {
      setParticipants(prev => prev.map(p => {
        const match = data.participants?.find(x => String(x.user_id) === String(p.sid));
        return match ? { ...p, hand_raised: match.hand_raised } : p;
      }));
    });

    socketRef.current.on('accent_status_changed', (data) => {
      setParticipants(prev => prev.map(p => {
        const match = data.participants?.find(x => String(x.user_id) === String(p.sid));
        return match ? { ...p, accent: match.accent } : p;
      }));
    });

    socketRef.current.on('receive_audio', (data) => {
      const receiveTime = Date.now();
      if (data.timestamp) {
        statsRef.current.latency = receiveTime - data.timestamp;
      }
      statsRef.current.received += 1;
      queueAudio(data);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_room', { room_code: roomCode });
        socketRef.current.disconnect();
      }
      stopRecording();
    };
  }, [roomCode]);

  // Join Room when ready
  useEffect(() => {
    if (isConnected && userData && !hasJoinedRoomRef.current && socketRef.current) {
      console.log(`🚀 Joining Room: ${roomCode} as ${userData.username}`);
      socketRef.current.emit('join_room', {
        room_code: roomCode,
        username: userData.username,
        user_id: userData.user_id
      });
      hasJoinedRoomRef.current = true;
    }
  }, [isConnected, userData, roomCode]);


  // ==========================================
  // 4. RECORDING & AUDIO LOGIC
  // ==========================================

  const startRecording = async () => {
    if (!hasPermissions) {
      // Re-request if missing
      requestPermissions();
      return;
    }

    if (isRecording) return;

    if (!socketRef.current?.connected) {
      console.log('⚠️ Socket not connected');
      return;
    }

    if (!userData?.user_id) {
      // Rare case due to fix, but safety check
      console.log('⚠️ User data waiting...');
      return;
    }

    try {
      setIsRecording(true);

      // Start backend session
      if (!streamingSessionStartedRef.current) {
        socketRef.current.emit("start_streaming", { platform: 'mobile' });
        streamingSessionStartedRef.current = true;
      }

      // Setup Listener
      const subscription = LiveAudioStream.on('data', (data) => {
        if (socketRef.current?.connected && !isMutedRef.current) {
          socketRef.current.emit("audio_stream_chunk", {
            audio_data: data, // Raw PCM
            platform: 'mobile',
            username,
            room_code: roomCode,
          });
          statsRef.current.sent += 1;
        }
      });

      audioSubscriptionRef.current = subscription;

      // 🔥 FIX: Try-Catch for "Uninitialized" error
      try {
        LiveAudioStream.start();
        console.log("🎙️ LiveAudioStream started");
      } catch (startError) {
        console.log("⚠️ Start failed, Re-initializing...", startError);
        LiveAudioStream.init(audioOptions);
        LiveAudioStream.start();
        console.log("🎙️ LiveAudioStream restarted");
      }

    } catch (err) {
      console.error("❌ Recording start failed:", err);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      LiveAudioStream.stop();
      if (audioSubscriptionRef.current) {
        audioSubscriptionRef.current.remove();
        audioSubscriptionRef.current = null;
      }
      // Optional: Don't stop streaming session on server to keep connection alive
      // if (streamingSessionStartedRef.current) { ... }
    } catch (e) {
      console.error("Stop recording error:", e);
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermissions(true);
      }
    }
  }


  // =======================================================
  // 5. PLAYBACK LOGIC (Optimized)
  // =======================================================

  const queueAudio = (audioData) => {
    const now = Date.now();
    recentlyPlayedRef.current = recentlyPlayedRef.current.filter(item => (now - item.playedAt) < DUPLICATE_WINDOW_MS);

    const isDuplicate =
      audioQueueRef.current.some(item => item.timestamp === audioData.timestamp && item.username === audioData.username) ||
      recentlyPlayedRef.current.some(item => (
        (item.timestamp === audioData.timestamp && item.username === audioData.username)
      ));

    if (isDuplicate) return;

    audioQueueRef.current.push({ ...audioData, queueTime: now });
    if (!isPlayingAudioRef.current) processAudioQueue();
  };

  const processAudioQueue = async () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingAudioRef.current = false;
      return;
    }

    isPlayingAudioRef.current = true;
    const audioData = audioQueueRef.current.shift();

    try {
      await playAudioChunkActual(audioData);

      recentlyPlayedRef.current.push({
        timestamp: audioData.timestamp,
        username: audioData.username,
        playedAt: Date.now()
      });

      if (audioQueueRef.current.length > 0) {
        await new Promise(r => setTimeout(r, NATURAL_PAUSE_MS));
      }
      processAudioQueue();
    } catch (error) {
      console.error("Play error:", error);
      await new Promise(r => setTimeout(r, NATURAL_PAUSE_MS));
      processAudioQueue();
    }
  };

  const playAudioChunkActual = async (audioData) => {
    try {
      const isWav = audioData.audio_data.startsWith('UklGR');
      const extension = isWav ? 'wav' : 'mp3';
      const path = `${RNFS.CachesDirectoryPath}/temp_${Date.now()}.${extension}`;
      await RNFS.writeFile(path, audioData.audio_data, 'base64');

      Sound.startPlayer(path);

      // Short wait for chunk to finish (approx)
      const duration = isWav ? 200 : 2000;
      await new Promise(resolve => setTimeout(resolve, duration));

      RNFS.unlink(path).catch(() => { });

    } catch (error) {
      console.log("Playback error", error);
    }
  };


  // ==========================================
  // 6. UI HANDLERS
  // ==========================================

  const handleMicToggle = () => {
    // Current state is stored in isListening (true = MUTED in your UI logic)
    // If isListening is TRUE -> We are Muted -> Want to Unmute
    // If isListening is FALSE -> We are Live -> Want to Mute

    // NOTE: Variable naming seems inverted based on UI text "Muted" when isListening is true.
    // Assuming: isListening = true means "Mic is Off / Muted UI shown"

    const newMutedState = !isListening;
    setIsListening(newMutedState);
    isMutedRef.current = newMutedState;

    if (newMutedState) {
      // User wants to MUTE
      stopRecording();
      console.log('🔇 Mic Muted');
    } else {
      // User wants to UNMUTE
      startRecording();
      console.log('🎤 Mic Live');
    }

    if (socketRef.current?.connected && userData) {
      socketRef.current.emit('toggle_mute', {
        muted: newMutedState,
        user_id: userData.user_id,
        room_code: roomCode
      });
    }
  };

  const handleEndCall = () => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("leave_room", { room_code: roomCode });
      socketRef.current.disconnect();
    }
    stopRecording();
    navigation.goBack();
  };

  const handleShare = () => {
    const link = `https://talkbrush.com/accent/room/${roomCode}`;
    Clipboard.setString(link);
    dispatch(showMessage({ type: 'success', text: 'Room link copied!' }));
  };

  const handleRaiseHand = () => {
    const newState = !handRaised;
    setHandRaised(newState);
    if (socketRef.current?.connected && userData) {
      socketRef.current.emit('raise_hand', { raised: newState, user_id: userData.user_id });
    }
  };

  const handleAccentChange = (item) => {
    setCurrentAccent(item.value);
    if (socketRef.current?.connected && userData) {
      socketRef.current.emit('change_accent', { accent: item.value, user_id: userData.user_id });
    }
    // Optimistic UI update
    setParticipants(prev => prev.map(p => p.username === username ? { ...p, accent: item.value } : p));
  };

  const formatDateTime = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString("en-US", { month: "short" });
    const year = now.getFullYear();
    const time = now.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit" });
    return `${day} ${month} ${year} | ${time}`;
  };


  return (
    <SafeAreaView style={styles.safeArea} edges={[0, 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <View style={styles.accentContainer}>
              <Text style={styles.accentLabel}>Change your accent</Text>
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
              />
            </View>
          </View>

          <Text style={styles.title}>Accent Talk Room</Text>

          <View style={styles.statusBadges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Room • {roomCode?.match(/.{1,3}/g)?.join("-")}</Text>
            </View>
            <View style={[styles.badge, isConnected ? styles.badgeGreen : styles.badgeRed]}>
              <Text style={styles.badgeText}>{isConnected ? "🟢 Live" : "🔴 Offline"}</Text>
            </View>
            <View style={[styles.badge, styles.badgePurple]}>
              <Text style={styles.badgeText}>{uiStats.latency}ms</Text>
            </View>
            <View style={[styles.badge, styles.badgeBlue]}>
              <Text style={styles.badgeText}>↑{uiStats.sent} ↓{uiStats.received}</Text>
            </View>
          </View>

          <VoiceWaveAnimation isListening={isListening} isRecording={isRecording} />

          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{isListening ? "Muted" : "Listening..."}</Text>
            {!isListening && <MaterialIcons name="mic" size={24} color="#EAB308" />}
          </View>

          {isListening && <Text style={styles.hintText}>You're muted — unmute yourself to speak.</Text>}

          <View style={styles.actionsRow}>
            <TouchableOpacity onPress={handleMicToggle} style={[styles.actionButton, isListening ? styles.mutedButton : styles.unmutedButton]}>
              <MaterialIcons name="mic" size={24} color={isListening ? "white" : "#374151"} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <FontAwesome name="share" size={24} color="#374151" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRaiseHand} style={[styles.actionButton, handRaised && styles.handRaisedButton]}>
              <MaterialIcons name="back-hand" size={24} color={handRaised ? "white" : "#374151"} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleEndCall} style={[styles.actionButton, styles.endCallButton]}>
              <MaterialIcons name="call-end" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.participantsContainer}>
            <Text style={styles.dateTimeText}>{formatDateTime()}</Text>
            <Text style={styles.participantsTitle}>Participants ({participants.length})</Text>

            {participants.length === 0 ? (
              <Text style={styles.noParticipants}>Waiting for participants...</Text>
            ) : (
              <View style={styles.participantsList}>
                {participants.map(participant => {
                  const isHost = roomDetails?.initiator_id === participant.sid;
                  const isMe = participant.username === username;

                  return (
                    <View
                      key={participant.sid}
                      style={[
                        styles.participantCard,
                        isHost ? styles.hostCard : styles.memberCard
                      ]}
                    >
                      <View style={styles.avatarContainer}>
                        <Image source={{ uri: participant.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.username)}&background=random` }} style={styles.avatarImage} />
                        <View style={styles.onlineIndicator} />
                      </View>
                      <View style={styles.participantInfo}>
                        <View style={styles.nameRow}>
                          <Text style={styles.participantName}>{participant.username}</Text>
                          {isHost && (
                            <View style={styles.hostBadge}>
                              <Text style={styles.hostText}>Host</Text>
                            </View>
                          )}
                          {isMe && (
                            <Text style={styles.youTag}>You</Text>
                          )}
                        </View>
                        <View style={styles.statusTags}>
                          <View style={[styles.tag, participant.muted ? styles.tagMuted : styles.tagLive]}>
                            <MaterialIcons name={participant.muted ? "mic-off" : "mic"} size={12} color={participant.muted ? "#DC2626" : "#16A34A"} />
                            <Text style={[styles.tagText, { color: participant.muted ? "#DC2626" : "#16A34A" }]}>  {participant.muted ? "Muted" : "Live"}</Text>
                          </View>
                          <View style={styles.tagColumn}>
                            {participant.hand_raised && (
                              <View style={styles.tagHand}>
                                <MaterialIcons name="back-hand" size={12} color="#B45309" />
                                <Text style={styles.tagText}>Raised</Text>
                              </View>
                            )}
                            <View style={styles.tagAccent}>
                              <Text style={styles.tagText}>{participant.accent?.replace('_', ' ') || 'American'}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  )
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = (theme) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.background },
  scrollContent: { flexGrow: 1 },
  container: { flex: 1, padding: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  accentContainer: { flex: 1 },
  accentLabel: { fontSize: moderateScale(14), color: theme.text, marginBottom: 8, fontFamily: Fonts.InterMedium },
  dropdown: { width: "100%", height: 50, backgroundColor: "white", borderRadius: 10, paddingHorizontal: 15, elevation: 2 },
  dropdownPlaceholder: { fontSize: 14, color: "#666" },
  dropdownText: { fontSize: 14, color: "black" },
  title: { fontSize: moderateScale(28), fontFamily: Fonts.InterBold, color: theme.text, textAlign: "center", marginTop: 20 },
  statusBadges: { flexDirection: "row", justifyContent: "center", flexWrap: "wrap", gap: 10, marginVertical: 15 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#E5E7EB", borderRadius: 20 },
  badgeGreen: { backgroundColor: "#DCFCE7" },
  badgeRed: { backgroundColor: "#FEE2E2" },
  badgePurple: { backgroundColor: "#F3E8FF" },
  badgeBlue: { backgroundColor: "#DBEAFE" },
  badgeText: { fontSize: moderateScale(12), color: "#1F2937", fontFamily: Fonts.InterMedium },
  waveContainer: { height: 150, justifyContent: "center", alignItems: "center", marginVertical: 30 },
  waveLine: { width: 200, height: 4, backgroundColor: "#38BDF8", borderRadius: 2, marginVertical: 5 },
  statusContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 10 },
  statusText: { fontSize: moderateScale(24), fontFamily: Fonts.InterBold, color: theme.text },
  hintText: { fontSize: moderateScale(14), color: "#666", textAlign: "center", marginBottom: 20 },
  actionsRow: { flexDirection: "row", justifyContent: "space-evenly", marginVertical: 30 },
  actionButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: "white", justifyContent: "center", alignItems: "center", elevation: 5 },
  mutedButton: { backgroundColor: "#374151" },
  unmutedButton: { backgroundColor: "#FBBF24" },
  handRaisedButton: { backgroundColor: "#EAB308" },
  endCallButton: { backgroundColor: "#EF4444" },
  participantsContainer: { marginTop: 20, backgroundColor: "white", padding: 20, borderRadius: 10, elevation: 2 },
  dateTimeText: { fontSize: moderateScale(12), color: theme.subText, textAlign: "center", marginBottom: 10 },
  participantsTitle: { fontSize: moderateScale(18), fontFamily: Fonts.InterBold, textAlign: "center", marginBottom: 15 },
  noParticipants: { textAlign: "center", color: "#666", paddingVertical: 20 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginVertical: 15 },
  sectionTitle: { fontSize: moderateScale(16), fontFamily: Fonts.InterBold, color: theme.text },
  participantsList: { gap: 10 },
  participantCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#F9FAFB", padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: 'transparent' },
  hostCard: { borderLeftWidth: 4, borderLeftColor: "#F59E0B", backgroundColor: "#FFFBEB" },
  memberCard: { borderLeftWidth: 4, borderLeftColor: "#3B82F6", backgroundColor: "white" },
  avatarContainer: { position: "relative", marginRight: 12 },
  avatarImage: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#E5E7EB" },
  onlineIndicator: { position: "absolute", bottom: 0, right: 0, width: 16, height: 16, backgroundColor: "#10B981", borderRadius: 8, borderWidth: 3, borderColor: "white" },
  participantInfo: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  participantName: { fontSize: moderateScale(16), fontFamily: Fonts.InterMedium, color: theme.text },
  youTag: { fontSize: moderateScale(12), color: "#059669", fontFamily: Fonts.InterBold, marginLeft: 8 },
  statusTags: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 10 },
  tag: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: "#E5E7EB", borderRadius: 20 },
  tagMuted: { backgroundColor: "#FEE2E2" },
  tagLive: { backgroundColor: "#DCFCE7" },
  tagText: { fontSize: moderateScale(12), fontFamily: Fonts.InterMedium },
  tagColumn: { gap: 8 },
  tagHand: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: "#FEF3C7", borderRadius: 20 },
  tagAccent: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: "#E0E7FF", borderRadius: 20 },
  memberAccent: { backgroundColor: "#F3F4F6" },
  hostBadge: {
    backgroundColor: "#F59E0B",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  hostText: {
    color: "white",
    fontSize: moderateScale(10),
    fontFamily: Fonts.InterBold,
  },
});

export default ConvoSpace;