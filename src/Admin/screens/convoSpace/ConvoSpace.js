import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts/ThemeProvider";
import { moderateScale } from "react-native-size-matters";
import Fonts from "../../../styles/GlobalFonts";
import Feather from "@react-native-vector-icons/feather";
import ImagePath from "../../../contexts/ImagePath";
import { useNavigation } from "@react-navigation/native";

const data = [
  { label: "Apple", value: "1" },
  { label: "Banana", value: "2" },
  { label: "Mango", value: "3" },
  { label: "Orange", value: "4" },
];

const topUsers = [
  { id: 1, name: "Frank", image: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Frank", image: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Frank", image: "https://i.pravatar.cc/150?img=3" },
];

const bottomUsers = [
  { id: 1, image: "https://i.pravatar.cc/150?img=4" },
  { id: 2, image: "https://i.pravatar.cc/150?img=5" },
  { id: 3, image: "https://i.pravatar.cc/150?img=6" },
  { id: 4, image: "https://i.pravatar.cc/150?img=7" },
  { id: 5, image: "https://i.pravatar.cc/150?img=8" },
];

const ConvoSpace = () => {
  const [value, setValue] = useState(null);
  const { theme } = useTheme();
  const styles = style(theme);
  const navigation = useNavigation();
  
  // Animation values for seamless scrolling
  const translateX1 = useRef(new Animated.Value(0)).current;
  const translateX2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const imageWidth = 300; 
    const animation1 = Animated.loop(
      Animated.timing(translateX1, {
        toValue: -imageWidth,
        duration: 3000,
        useNativeDriver: true,
      })
    );
    translateX2.setValue(imageWidth);
    const animation2 = Animated.loop(
      Animated.timing(translateX2, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    animation1.start();
    animation2.start();

    return () => {
      animation1.stop();
      animation2.stop();
    };
  }, []);

  const formatDateTime = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear().toString();

    const time = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${day} ${month} ${year} | ${time}`;
  };

  const now = new Date();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
      <ScrollView>
        <View style={styles.pageBg}>
          <View style={styles.headerRow}>
            <Dropdown
              style={styles.dropdownContainer}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Choose Account"
              value={value}
              onChange={(item) => setValue(item.value)}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              renderRightIcon={() => (
                <MaterialIcons
                  name="arrow-drop-down"
                  color="black"
                  size={28}
                  style={styles.dropdownIcon}
                />
              )}
            />
            <Text style={styles.smallText}>{formatDateTime(now)}</Text>
          </View>

          <Text style={styles.assistantTitle}>Mia - Assistant Vocal</Text>
          <Text style={styles.subHeading}>
            Specialized AI Assistant for Ivory Coast
          </Text>

          {/* Animated Call Lines Image - Seamless Horizontal Scroll */}
          <View style={styles.animatedImageContainer}>
            <Animated.Image
              source={ImagePath.callLines}
              style={[
                styles.callImage,
                {
                  position: 'absolute',
                  transform: [{ translateX: translateX1 }],
                },
              ]}
              resizeMode="contain"
            />
            <Animated.Image
              source={ImagePath.callLines}
              style={[
                styles.callImage,
                {
                  position: 'absolute',
                  transform: [{ translateX: translateX2 }],
                },
              ]}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.listeningText}>Listening...</Text>
          <MaterialIcons name="mic" color="darkgoldenrod" size={50} style={styles.mainMicIcon} />

          <View style={styles.actionsRow}>
            <TouchableOpacity>
              <MaterialIcons name="mic" color="black" size={30} style={styles.iconBg} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Feather name="upload" color="black" size={30} style={styles.iconBg} />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialIcons name="thumb-up-off-alt" color="black" size={30} style={styles.iconBg} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleBack}>
              <MaterialIcons
                name="call-end"
                color="white"
                size={30}
                style={[styles.iconBg, styles.callEndBtn]}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            <View style={styles.topRow}>
              {topUsers.map((user) => (
                <View key={user.id} style={styles.avatarContainer}>
                  <Image source={{ uri: user.image }} style={styles.avatarLarge} />
                  <Text style={styles.smallText}>{user.name}</Text>
                </View>
              ))}
            </View>

            <View style={styles.bottomRow}>
              <View style={styles.rightAvatars}>
                <View style={styles.avatarStack}>
                  {bottomUsers.slice(0, 4).map((user, index) => (
                    <Image
                      key={user.id}
                      source={{ uri: user.image }}
                      style={[
                        styles.avatarSmall,
                        { marginLeft: index === 0 ? 0 : -10 },
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.smallText}>+ 10 More</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
  );
};

export default ConvoSpace;

const style = (theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    pageBg: {
      flex: 1,
      backgroundColor: theme.background,
      paddingVertical: 20,
      paddingHorizontal: 20,
      alignItems: "center",
    },
    headerRow: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dropdownContainer: {
      height: 50,
      backgroundColor: "white",
      marginTop: 5,
      borderRadius: 10,
      width: "40%",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingHorizontal: 15,
      elevation: 2,
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    dropdownPlaceholder: {
      color: "black",
      fontSize: 12,
    },
    dropdownSelectedText: {
      color: "black",
      fontSize: 12,
    },
    dropdownIcon: {
      marginStart: 10,
    },
    assistantTitle: {
      fontSize: moderateScale(28),
      fontFamily: Fonts.InterBold,
      color: theme.text,
      textAlign: "center",
      width: "70%",
      marginTop: 30,
    },
    subHeading: {
      fontSize: moderateScale(12),
      color: "grey",
      fontWeight: "400",
      fontFamily: Fonts.InterMedium,
    },
    animatedImageContainer: {
      width: "100%",
      height: 200,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    callImage: {
      height: 200,
      width: "100%",
    },
    listeningText: {
      fontSize: moderateScale(28),
      fontFamily: Fonts.InterBold,
      color: theme.text,
      textAlign: "center",
      width: "70%",
      marginTop: 30,
    },
    mainMicIcon: {
      marginTop: 5,
    },
    actionsRow: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      width: "70%",
      marginTop: 30,
    },
    container: {
      padding: 20,
      alignItems: "center",
      marginTop: 30,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "90%",
      marginBottom: 20,
    },
    avatarContainer: {
      alignItems: "center",
    },
    avatarLarge: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.background,
    },
    bottomRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "90%",
    },
    rightAvatars: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatarStack: {
      flexDirection: "row",
    },
    avatarSmall: {
      width: 35,
      height: 35,
      borderRadius: 18,
      borderWidth: 2,
      borderColor: "white",
    },
    smallText: {
      fontSize: moderateScale(12),
      color: theme.subText,
      fontFamily: Fonts.InterMedium,
    },
    iconBg: {
      alignSelf: "center",
      width: 50,
      height: 50,
      padding: 10,
      backgroundColor: "white",
      borderRadius: 100,
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    callEndBtn: {
      backgroundColor: "red",
    },
  });