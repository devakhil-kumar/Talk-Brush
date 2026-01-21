// VoiceWaveAnimation.jsx
// Add this as a separate component file

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const VoiceWaveAnimation = ({ isListening, isRecording }) => {
    // Create 60 bars for ultra smooth wave effect
    const bars = useRef(
        Array.from({ length: 60 }, () => new Animated.Value(0.3))
    ).current;

    useEffect(() => {
        if (!isListening && isRecording) {
            // When speaking (unmuted and recording), animate bars
            const animations = bars.map((bar, index) => {
                return Animated.loop(
                    Animated.sequence([
                        Animated.timing(bar, {
                            toValue: 0.8 + Math.random() * 0.5, // Random heights for natural effect
                            duration: 250 + Math.random() * 150, // Faster animation
                            useNativeDriver: true,
                            delay: index * 10, // Reduced stagger for smoother flow
                        }),
                        Animated.timing(bar, {
                            toValue: 0.2 + Math.random() * 0.2,
                            duration: 250 + Math.random() * 150,
                            useNativeDriver: true,
                        }),
                    ])
                );
            });

            animations.forEach(anim => anim.start());

            return () => {
                animations.forEach(anim => anim.stop());
            };
        } else {
            // When muted, reset to minimal height
            bars.forEach(bar => {
                Animated.timing(bar, {
                    toValue: 0.3,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            });
        }
    }, [isListening, isRecording]);

    // Calculate mountain shape height for each bar
    const getMountainHeight = (index, total) => {
        const center = total / 2;
        const distanceFromCenter = Math.abs(index - center);
        const maxDistance = total / 2;
        // Creates a bell curve: 1 at center, decreasing to 0.2 at edges
        const heightFactor = 1 - (distanceFromCenter / maxDistance) * 0.8;
        return heightFactor;
    };

    return (
        <View style={styles.container}>
            <View style={styles.waveContainer}>
                {bars.map((bar, index) => {
                    const mountainHeight = getMountainHeight(index, bars.length);

                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.bar,
                                {
                                    // Base height follows mountain shape
                                    height: 80 * mountainHeight,
                                    transform: [
                                        {
                                            scaleY: bar.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.3, 1],
                                            }),
                                        },
                                    ],
                                    opacity: bar.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.5, 1],
                                    }),
                                },
                                // Color gradient effect - smooth blue to purple to pink
                                {
                                    backgroundColor:
                                        index < 20
                                            ? '#38BDF8' // Blue (first 1/3)
                                            : index < 40
                                                ? '#A78BFA' // Purple (middle 1/3)
                                                : '#F472B6', // Pink (last 1/3)
                                },
                            ]}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 30,
    },
    waveContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        gap: 2, // Minimal gap for 60 bars
        width: '100%',
        paddingHorizontal: 15, // Less padding for more space
    },
    bar: {
        flex: 1,
        maxWidth: 4, // Thinner bars for 60 lines
        // height is now dynamic based on mountain shape
        borderRadius: 2,
        backgroundColor: '#38BDF8',
    },
});

export default VoiceWaveAnimation;