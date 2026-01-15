import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import Fonts from '../../../../styles/GlobalFonts';
import { useTheme } from '../../../../contexts/ThemeProvider';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const { width } = Dimensions.get('window');

const RoomInviteModal = ({ visible, onClose, roomData, onJoinRoom, isJoining }) => {
    const { theme } = useTheme();
    const styles = style(theme);
    console.log(roomData, 'ROOMDATA')

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <MaterialIcons name="close" size={24} color={theme.subText} />
                    </TouchableOpacity>

                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <MaterialIcons name="people" size={40} color="#fff" />
                    </View>

                    {/* Modal Header */}
                    <Text style={styles.modalTitle}>You're Invited!</Text>
                    <Text style={styles.modalSubtitle}>Join this TalkBrush room</Text>

                    {/* Room Details */}
                    {roomData ? (
                        <View style={styles.roomDetailsContainer}>
                            {/* Room Code Card */}
                            <View style={[styles.infoCard, styles.blueCard]}>
                                <View style={styles.cardIconContainer}>
                                    <MaterialIcons name="shield" size={24} color="#4F46E5" />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardLabel}>Room Code</Text>
                                    <Text style={styles.cardValue}>
                                        {roomData?.room_code || 'N/A'}
                                    </Text>
                                </View>
                            </View>

                            {/* Host Card */}
                            <View style={[styles.infoCard, styles.purpleCard]}>
                                <View style={styles.cardIconContainer}>
                                    <MaterialIcons name="person" size={24} color="#9333EA" />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardLabel}>Host</Text>
                                    <Text style={styles.cardValue}>
                                        {roomData?.initiator_name || 'Unknown'}
                                    </Text>
                                </View>
                            </View>

                            {/* Participants Card */}
                            <View style={[styles.infoCard, styles.greenCard]}>
                                <View style={styles.cardIconContainer}>
                                    <MaterialIcons name="people" size={24} color="#059669" />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardLabel}>Participants</Text>
                                    <Text style={styles.cardValue}>
                                        {roomData?.members_joined || 0}
                                    </Text>
                                </View>
                            </View>

                            {/* Created At Card */}
                            {roomData.created_at && (
                                <View style={[styles.infoCard, styles.orangeCard]}>
                                    <View style={styles.cardIconContainer}>
                                        <MaterialIcons name="schedule" size={24} color="#EA580C" />
                                    </View>
                                    <View style={styles.cardContent}>
                                        <Text style={styles.cardLabel}>Created At</Text>
                                        <Text style={styles.cardValue}>
                                            {roomData.created_at}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    ) : (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#4F46E5" />
                            <Text style={styles.loadingText}>Loading room details...</Text>
                        </View>
                    )}

                    {/* Join Button */}
                    <TouchableOpacity
                        style={[styles.joinButton, isJoining && styles.disabledButton]}
                        onPress={onJoinRoom}
                        disabled={isJoining}
                    >
                        {isJoining ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.joinButtonText}>Join This Room</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default RoomInviteModal;

const style = (theme) =>
    StyleSheet.create({
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContent: {
            width: width * 0.9,
            maxWidth: 420,
            backgroundColor: theme.background || '#FFFFFF',
            borderRadius: 20,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
        },
        closeButton: {
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 1,
            padding: 4,
        },
        iconContainer: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#4F46E5',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 10,
            marginBottom: 20,
        },
        modalTitle: {
            fontSize: moderateScale(25),
            fontFamily: Fonts.InterBold,
            color: theme.text || '#000000',
            textAlign: 'center',
            marginBottom: 8,
        },
        modalSubtitle: {
            fontSize: moderateScale(14),
            fontFamily: Fonts.InterMedium,
            color: theme.subText || '#6B7280',
            textAlign: 'center',
            marginBottom: 24,
        },
        roomDetailsContainer: {
            marginBottom: 24,
        },
        infoCard: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
        },
        blueCard: {
            backgroundColor: '#EEF2FF',
        },
        purpleCard: {
            backgroundColor: '#FAF5FF',
        },
        greenCard: {
            backgroundColor: '#F0FDF4',
        },
        orangeCard: {
            backgroundColor: '#FFF7ED',
        },
        cardIconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
        },
        cardContent: {
            flex: 1,
        },
        cardLabel: {
            fontSize: moderateScale(13),
            fontFamily: Fonts.InterMedium,
            color: '#6B7280',
            marginBottom: 4,
        },
        cardValue: {
            fontSize: moderateScale(16),
            fontFamily: Fonts.InterBold,
            color: '#000000',
        },
        loadingContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 40,
        },
        loadingText: {
            marginTop: 15,
            fontSize: moderateScale(14),
            fontFamily: Fonts.InterMedium,
            color: theme.subText || '#6B7280',
        },
        joinButton: {
            width: '100%',
            paddingVertical: 16,
            borderRadius: 12,
            background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)',
            backgroundColor: '#4F46E5',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#4F46E5',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        },
        joinButtonText: {
            color: '#FFFFFF',
            fontSize: moderateScale(16),
            fontFamily: Fonts.InterBold,
        },
        disabledButton: {
            opacity: 0.6,
        },
    });