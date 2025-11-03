import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import GlobalStyles from '../../../../styles/GlobalStyles';
import { moderateScale } from 'react-native-size-matters';
import { useTheme } from '../../../../contexts/ThemeProvider';
import Fonts from '../../../../styles/GlobalFonts';

const WebinarCard = ({ item }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const renderPictures = () => {
    if (!item.pictures || item.pictures.length === 0) return null;

    const maxVisible = 3;
    const pictures = item.pictures.slice(0, maxVisible);
    const remaining = item.pictures.length - maxVisible;

    return (
      <View style={styles.picturesContainer}>
        {pictures.map((picture, index) => (
          <View
            key={index}
            style={[styles.pictureWrapper, index > 0 && styles.pictureOverlap]}
          >
            <Image source={{ uri: picture }} style={styles.picture} />
          </View>
        ))}

        {remaining > 0 && (
          <View style={[styles.pictureWrapper, styles.pictureCount, styles.pictureOverlap]}>
            <Text style={styles.pictureCountText}>+{remaining}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.sideBar} />
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <Text style={styles.time}>{item.time}</Text>
          {renderPictures()}
        </View>

        <Text style={styles.title}>{item.fullName}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </View>
  );
};

export default WebinarCard;

const createStyles = (theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.cardBackground,
      borderRadius: 15,
      marginTop: 12,
      flexDirection: 'row',
      overflow: 'hidden',
      shadowColor: theme.mode === 'dark' ? '#000' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.mode === 'dark' ? 0.4 : 0.08,
      shadowRadius: 4,
      elevation: 6,
      marginBottom: 10,
      width: GlobalStyles.windowWidth / 1.4,
      marginLeft: 10,
    },
    sideBar: {
      width: 16,
      backgroundColor: theme.secandprimary,
      borderTopLeftRadius: 15,
      borderBottomLeftRadius: 15,
    },
    cardContent: {
      padding: 16,
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    time: {
      fontSize: 13,
      color: theme.subText,
      fontFamily: Fonts.InterRegular
    },
    picturesContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pictureWrapper: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: theme.cardBackground,
      overflow: 'hidden',
    },
    picture: {
      width: '100%',
      height: '100%',
    },
    pictureOverlap: {
      marginLeft: -8,
    },
    pictureCount: {
      backgroundColor: theme.secandprimary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    pictureCountText: {
      color: theme.text,
      fontSize: 11,
      fontWeight: '600',
    },
    title: {
      fontSize: 18,
      color: theme.text,
      fontFamily: Fonts.InterSemiBold,
      marginBottom: 8,
    },
    description: {
      fontSize: moderateScale(14),
      color: theme.subText,
      fontFamily:Fonts.InterRegular,
      lineHeight: 20,
    },
  });
