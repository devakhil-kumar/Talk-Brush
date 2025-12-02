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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import FontAwesome from "@react-native-vector-icons/fontawesome";
import { Dropdown } from "react-native-element-dropdown";
import { moderateScale } from "react-native-size-matters";
import io from "socket.io-client";
import { useDispatch } from "react-redux";
// import { getRoomDetailsThunk } from "../../features/roomSlice";
import Fonts from "../../../styles/GlobalFonts";
import Sound from 'react-native-nitro-sound';
import RNFS from "react-native-fs";
import { useTheme } from "../../../contexts/ThemeProvider";

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

  // State
  const [isListening, setIsListening] = useState(true);
  const [waveAnimation] = useState(new Animated.Value(0));
  const [currentAccent, setCurrentAccent] = useState("american");
  const [currentGender, setCurrentGender] = useState("male");
  const [handRaised, setHandRaised] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [username, setUsername] = useState(`Guest_${Math.random().toString(36).substr(2, 6)}`);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState({ sent: 0, received: 0, latency: 0 });
  const [roomDetails, setRoomDetails] = useState(null);
  const [isRecorderReady, setIsRecorderReady] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  let isRecordingActive = false;  // ← Yeh add kar do top pe
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

  const NATURAL_PAUSE_MS = 450;

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


  // const requestPermissions = async () => {
  //   try {
  //     if (Platform.OS === 'android') {
  //       const granted = await PermissionsAndroid.requestMultiple([
  //         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //       ]);

  //       const allGranted = Object.values(granted).every(
  //         (status) => status === PermissionsAndroid.RESULTS.GRANTED
  //       );

  //       setHasPermissions(allGranted);
  //       console.log(hasPermissions, 'hasPermissions')
  //       if (!allGranted) {
  //         Alert.alert("Permissions Required", "Please grant microphone and storage permissions");
  //         return;
  //       }
  //     } else {
  //       // iOS permissions are handled through Info.plist
  //       setHasPermissions(true);
  //     }

  //     console.log("✅ Permissions granted");
  //   } catch (error) {
  //     console.error("❌ Permission error:", error);
  //     Alert.alert("Error", "Could not request permissions");
  //   }
  // };

  // Wave Animation


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

  // Fetch Room Details
  // useEffect(() => {
  //   if (roomCode) {
  //     dispatch(getRoomDetailsThunk(roomCode)).then((response) => {
  //       if (response.payload) {
  //         setRoomDetails(response.payload);
  //         setUsername(response.payload.initiator_name);

  //         const apiParticipants = response.payload.members.map((member) => ({
  //           username: member.username,
  //           sid: member.user_id,
  //           muted: true,
  //           hand_raised: false,
  //           accent: "american",
  //           gender: "male",
  //         }));
  //         setParticipants(apiParticipants);
  //       }
  //     });
  //   }
  // }, [dispatch, roomCode]);

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

      socketRef.current.emit("join_room", {
        room_code: roomCode,
        username: username,
        user_id: roomDetails?.initiator_id,
      });
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("❌ Disconnected:", reason);
      setIsConnected(false);
    });

    socketRef.current.on("reconnect", (attemptNumber) => {
      console.log("🔄 Reconnected after", attemptNumber, "attempts");
      setIsConnected(true);
      socketRef.current.emit("join_room", {
        room_code: roomCode,
        username: username,
      });
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

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave_room", { room_code: roomCode });
        socketRef.current.disconnect();
      }
      stopRecording();
    };
  }, [roomCode, username, navigation]);

  // Audio Recording with NitroSound
  // const startRecording = async () => {
  //   if (!hasPermissions) return;
  //   try {
  //     Sound.addRecordBackListener((e) => {
  //       //     console.log('Recording:', e.currentPosition);
  //     });

  //     if (!streamingSessionStartedRef.current) {
  //       socketRef.current.emit("start_streaming", {});
  //       streamingSessionStartedRef.current = true;
  //     }
  //     // ← YEH LINE CHANGE KI (unique filename har baar)
  //     const recordPath = Platform.select({
  //       ios: `recording_${Date.now()}.m4a`,
  //       android: `${RNFS.CachesDirectoryPath}/recording_${Date.now()}.aac`,
  //     });
  //     const audioSet = {
  //       AudioEncodingBitRate: 96000,
  //       AudioSampleRate: 44100,
  //       AudioChannels: 1,
  //       AudioEncoding: 'mp4a',
  //     };
  //     await Sound.startRecorder(recordPath, audioSet, true);
  //     recordingIntervalRef.current = setInterval(async () => {
  //       if (isMutedRef.current) return;
  //       try {
  //         const audioURI = await Sound.stopRecorder();
  //         const fileInfo = await RNFS.stat(audioURI);
  //         if (fileInfo.size < 500) {  // too small = silence
  //           await RNFS.unlink(audioURI).catch(() => {});
  //           await Sound.startRecorder(recordPath, audioSet, true);
  //           return;
  //         }
  //         const base64Audio = await RNFS.readFile(audioURI, 'base64');
  //         socketRef.current.emit("audio_stream_chunk", {
  //           audio_data: base64Audio,
  //           username: username,
  //           timestamp: Date.now(),
  //         });
  //         setStats(prev => ({ ...prev, sent: prev.sent + 1 }));
  //         console.log(`Sent chunk (${base64Audio.length} bytes)`);
  //         // Delete old file
  //         await RNFS.unlink(audioURI).catch(() => {});
  //         // ← NEW UNIQUE PATH FOR NEXT CHUNK
  //         const nextPath = Platform.select({
  //           ios: `recording_${Date.now()}.m4a`,
  //           android: `${RNFS.CachesDirectoryPath}/recording_${Date.now()}.aac`,
  //         });
  //         await Sound.startRecorder(nextPath, audioSet, true);
  //       } catch (err) {
  //         if (err.message.includes('stop failed')) {
  //           console.log("Silence chunk — skipped");
  //           // Restart with new path
  //           const nextPath = Platform.select({
  //             ios: `recording_${Date.now()}.m4a`,
  //             android: `${RNFS.CachesDirectoryPath}/recording_${Date.now()}.aac`,
  //           });
  //           await Sound.startRecorder(nextPath, audioSet, true);
  //         } else {
  //           console.error("Chunk error:", err);
  //         }
  //       }
  //     }, 280);  
  //   } catch (e) {
  //     console.error("Start recording error:", e);
  //   }
  // };

const startRecording = async () => {
  if (!hasPermissions || isRecordingActive) return;
  setIsRecorderReady(false);  // Reset flag

  try {
    isRecordingActive = true;

    Sound.addRecordBackListener((e) => {
      if (e.currentPosition > 50) {  // 50ms wait for ready
        setIsRecorderReady(true);
      }
    });

    if (!streamingSessionStartedRef.current) {
      socketRef.current.emit("start_streaming", {});
      streamingSessionStartedRef.current = true;
    }

    // Start with delay for Android stability
    setTimeout(async () => {
      const recordPath = Platform.select({
        ios: `rec_${Date.now()}.m4a`,
        android: `${RNFS.CachesDirectoryPath}/rec_${Date.now()}.aac`,
      });

      const audioSet = {
        AudioEncodingBitRate: 128000,
        AudioSampleRate: 44100,
        AudioChannels: 1,
        AudioEncoding: 'mp4a',
      };

      await Sound.startRecorder(recordPath, audioSet, true);
      console.log("Recorder started safely");

      // Interval start sirf jab ready ho
      recordingIntervalRef.current = setInterval(async () => {
        if (isMutedRef.current || !isRecorderReady) return;

        try {
          const audioURI = await Sound.stopRecorder();

          const fileStats = await RNFS.stat(audioURI);
          if (fileStats.size > 500) {
            const base64Audio = await RNFS.readFile(audioURI, 'base64');

            socketRef.current.emit("audio_stream_chunk", {
              audio_data: base64Audio,
              username: username,
              accent: currentAccent,
              timestamp: Date.now(),
            });

            setStats((prev) => ({ ...prev, sent: prev.sent + 1 }));
            console.log(`📤 Sent chunk (${base64Audio.length} bytes)`);
          } else {
            console.log("⚠️ Empty chunk skipped");
          }

          await RNFS.unlink(audioURI).catch(() => {});

          // Restart with new path
          const newPath = Platform.select({
            ios: `rec_${Date.now()}.m4a`,
            android: `${RNFS.CachesDirectoryPath}/rec_${Date.now()}.aac`,
          });
          await Sound.startRecorder(newPath, audioSet, true);

        } catch (err) {
          if (err.message.includes('stop failed') || err.message.includes('unavailable')) {
            console.log("⚠️ Recorder crash (silence/race) — restarting");
            // Force restart
            const newPath = Platform.select({
              ios: `rec_${Date.now()}.m4a`,
              android: `${RNFS.CachesDirectoryPath}/rec_${Date.now()}.aac`,
            });
            await Sound.startRecorder(newPath, audioSet, true);
          } else {
            console.error("Unexpected chunk error:", err);
          }
        }
      }, 300);  // 300ms for extra stability

    }, 100);  // 100ms delay start ke liye

  } catch (error) {
    console.error("❌ Start recording error:", error);
    isRecordingActive = false;
  }
};

const stopRecording = async () => {
  isRecordingActive = false;
  setIsRecorderReady(false);

  if (recordingIntervalRef.current) {
    clearInterval(recordingIntervalRef.current);
    recordingIntervalRef.current = null;
  }

  Sound.removeRecordBackListener();

  try {
    if (await Sound.isRecording()) {  // Check if actually recording
      await Sound.stopRecorder();
    }
  } catch (error) {
    if (error.message.includes('not started') || error.message.includes('unavailable')) {
      console.log("⚠️ Stop ignored (not active) — safe");
    } else {
      console.error("❌ Unexpected stop error:", error);
    }
  }

  if (streamingSessionStartedRef.current) {
    socketRef.current.emit("stop_streaming");
    streamingSessionStartedRef.current = false;
    console.log("⏹️ Streaming stopped");
  }

  console.log("🛑 Recording stopped safely");
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
      console.log(`🎵 Playing from: ${audioData.username}`);
      // Save to temp file
      const audioPath = `${RNFS.CachesDirectoryPath}/temp_play_${Date.now()}.aac`;
      await RNFS.writeFile(audioPath, audioData.audio_data, "base64");
      // Add listeners
      Sound.addPlayBackListener((e) => {
        console.log('Playback progress:', e.currentPosition);
      });
      Sound.addPlaybackEndListener(() => {
        console.log("Playback finished");
        Sound.removePlayBackListener();
        Sound.removePlaybackEndListener();
        RNFS.unlink(audioPath).catch(() => { });
      });
      // Start playback (singleton)
      await Sound.startPlayer(audioPath);
      // Wait for end (via listener)
      await new Promise((resolve) => {
        setTimeout(() => resolve(), 5000);  // Fallback timeout, listener handles actual end
      });
      console.log("✅ Playback done");
    } catch (err) {
      console.error("❌ Play error:", err);
      Sound.removePlayBackListener();
      Sound.removePlaybackEndListener();
      throw err;
    }
  };

  // Handlers
 const handleMicToggle = () => {
  const newMutedState = !isListening;
  setIsListening(newMutedState);
  isMutedRef.current = newMutedState;

  console.log(`🎤 ${newMutedState ? "MUTED" : "UNMUTED"}`);

  if (newMutedState) {
    stopRecording();
  } else {
    startRecording();
    // Wait for ready before logging
    setTimeout(() => {
      if (isRecorderReady) console.log("✅ Ready to speak");
    }, 500);
  }

  if (socketRef.current && socketRef.current.connected) {
    socketRef.current.emit("toggle_mute", { muted: newMutedState });
  }
};

  const handleEndCall = () => {
    console.log("📞 Ending call...");

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("leave_room", { room_code: roomCode });
      socketRef.current.disconnect();
    }

    stopRecording();
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
      socketRef.current.emit("raise_hand", { raised: newHandState });
    }
  };

  const handleAccentChange = (item) => {
    setCurrentAccent(item.value);
    console.log(`🗣️ Accent changed: ${item.value}`);

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("change_accent", { accent: item.value });
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
                <View key={participant.sid || index} style={styles.participantCard}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {participant.username.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.participantInfo}>
                    <Text style={styles.participantName}>
                      {participant.username}
                      {participant.sid === roomDetails?.initiator_id && " (Host)"}
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
    dropdown: {
      width: "45%",
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