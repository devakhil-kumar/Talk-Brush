import React, { useRef, useState } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import Carousel from 'react-native-reanimated-carousel';
import { Pagination } from 'react-native-reanimated-carousel'; // optional built-in dots
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import GlobalStyles from '../../../../styles/GlobalStyles';
import { useTheme } from '../../../../contexts/ThemeProvider';
import { moderateScale } from 'react-native-size-matters';
import Fonts from '../../../../styles/GlobalFonts';

const { width, height } = Dimensions.get('window');
const SLIDE_WIDTH = width * 0.85;
const AUTO_PLAY_INTERVAL = 5000;


const SmoothFadeCarousel = ({ data }) => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme } = useTheme();
  const styles = style(theme)

  const renderItem = ({ item, index, animationValue }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [0.3, 1, 0.3],
        Extrapolation.CLAMP
      );

      const scale = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [0.85, 1, 0.85],
        Extrapolation.CLAMP
      );

      return {
        opacity,
        transform: [{ scale }],
      };
    });

    return (
      <Animated.View style={[styles.slideContainer, animatedStyle]}>
        <Image source={item.image} style={styles.slideImage} resizeMode="cover" />
        <View style={styles.textContainer}>
          <Text style={styles.slideTitle}>{item.title}</Text>
          <Text style={styles.slideDescription}>{item.description}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        width={SLIDE_WIDTH}
        height={height / 1.8}
        data={data}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        loop={true}
        autoPlay={true}
        autoPlayInterval={AUTO_PLAY_INTERVAL}
        pagingEnabled={true}
        snapEnabled={true}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={renderItem}
        style={{ width: width / 1.2 }}
        defaultScrollAnimationDuration={3000}
      />
      <View style={styles.paginationContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.selectedDot
            ]}
          />
        ))}
      </View>
    </View>
  );
}


const style = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContainer: {
    width: SLIDE_WIDTH,
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  slideImage: {
    width: GlobalStyles.windowWidth / 1.6,
    height: GlobalStyles.windowHeight / 3.3,

  },
  textContainer: {
    padding: 16,
  },
  slideTitle: {
    fontSize: moderateScale(20),
    fontFamily: Fonts.InterMedium,
    color: theme.text,
  },
  slideDescription: {
    fontSize: moderateScale(13),
    color: theme.subText,
    fontFamily: Fonts.InterRegular,
    marginTop: 8,
  },

  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  selectedDot: {
    backgroundColor: '#000',
    width: 24,
  },
});

export default SmoothFadeCarousel;