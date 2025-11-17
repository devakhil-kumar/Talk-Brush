import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@react-native-vector-icons/feather';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import WebinarCard from './components/WebinarCard';
import { useDispatch, useSelector } from 'react-redux';
import { addEvent, fetchEvents, resetAddEventState, updateEvent, resetUpdateEventState, deleteEvent } from '../../../app/features/eventSlice';
import { useTheme } from '../../../contexts/ThemeProvider';
import Fonts from '../../../styles/GlobalFonts';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import GlobalStyles from '../../../styles/GlobalStyles';
import Ionicons from '@react-native-vector-icons/ionicons';
import AddEventModal from '../../../Admin/screens/event/components/AddEventModal';
import { showMessage } from '../../../app/features/messageSlice';
import ConfirmModal from '../users/components/ConfirmModal';

const Event = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [deleteEventId, setDeleteEventId] = useState();
    const [editingEvent, setEditingEvent] = useState(null);
    const insets = useSafeAreaInsets();

    const { list, page, loading, todayslist, addLoading, updateLoading, updateSuccess, deleteLoading } = useSelector((state) => state.eventlist);

    useEffect(() => {
        dispatch(fetchEvents(1));
    }, [dispatch, updateSuccess,]);

    const handleCreateEvent = async (eventData) => {
        try {
            const res = await dispatch(addEvent(eventData)).unwrap();
            dispatch(resetAddEventState());
            setModalVisible(false);
            dispatch(
                showMessage({
                    type: 'success',
                    text: res?.message || 'Event created successfully',
                })
            );
        } catch (error) {
            console.log(error, 'error')
            dispatch(
                showMessage({
                    type: 'error',
                    text: error || 'Failed to create event',
                })
            );
        }
    };

    const handleUpdateEvent = async (eventData) => {
        try {
            const res = await dispatch(updateEvent({
                eventId: editingEvent._id,
                eventData
            })).unwrap();
            dispatch(resetUpdateEventState());
            setModalVisible(false);
            setEditingEvent(null);
            dispatch(
                showMessage({
                    type: 'success',
                    text: res?.message || 'Event updated successfully',
                })
            );
        } catch (error) {
            console.log(error, 'error')
            dispatch(
                showMessage({
                    type: 'error',
                    text: error || 'Failed to update event',
                })
            );
        }
    };


    const handleDeleteConfirm = async () => {
        try {
            await dispatch(deleteEvent(deleteEventId)).unwrap();

            setConfirmVisible(false);
            setDeleteEventId(null);
            dispatch(
                showMessage({
                    type: 'success',
                    text: 'Event deleted successfully',
                })
            );
        } catch (error) {
            dispatch(
                showMessage({
                    type: 'error',
                    text: error || 'Failed to delete event',
                })
            );
        }
    };

    const handleEditPress = (event) => {
        setEditingEvent(event);
        setModalVisible(true);
    };

    const handleDeletePress = (event) => {
        setConfirmVisible(true)
        setDeleteEventId(event._id)
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setEditingEvent(null);
    };

    const handleModalSubmit = (eventData) => {
        if (editingEvent) {
            handleUpdateEvent(eventData);
        } else {
            handleCreateEvent(eventData);
        }
    };

    const groupEventsByDate = (events) => {
        if (!Array.isArray(events) || events.length === 0) return [];
        const grouped = events.reduce((acc, event) => {
            if (!event || !event.date) return acc;
            const dateKey = new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(event);
            return acc;
        }, {});
        return Object.entries(grouped).map(([date, events]) => ({ date, events }));
    };

    const TodaySection = ({ data }) => {
        const safeData = Array.isArray(data) ? data : [];
        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name='time-outline' size={20} color={theme.text} />
                    <Text style={styles.sectionTitle}>Today</Text>
                </View>
                {safeData.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No events available</Text>
                    </View>
                ) : (
                    <FlatList
                        data={safeData}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <WebinarCard
                                item={item}
                                index={index}
                                onEditPress={() => handleEditPress(item)}
                                onDeletePress={() => handleDeletePress(item)}
                            />
                        )}
                        keyExtractor={(item, index) => item?._id || index.toString()}
                        contentContainerStyle={styles.horizontalList}
                        removeClippedSubviews={false}
                    />
                )}
            </View>
        );
    };

    const DateGroupSection = ({ dateGroup }) => (
        <View style={styles.section}>
            <View style={styles.dateHeader}>
                <Text style={styles.dateTitle}>{dateGroup.date}</Text>
                <TouchableOpacity>
                    <Feather name='chevron-right' color={theme.text} size={22} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={dateGroup.events}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <WebinarCard
                        item={item}
                        index={index}
                        onEditPress={() => handleEditPress(item)}
                        onDeletePress={() => handleDeletePress(item)}
                    />
                )}
                keyExtractor={(item, index) => item?._id || index.toString()}
                contentContainerStyle={styles.horizontalList}
                removeClippedSubviews={false}
            />
        </View>
    );

    const groupedEvents = groupEventsByDate(list);

    if (loading || addLoading || updateLoading || deleteLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={theme.secandprimary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name='chevron-left' color={theme.text} size={25} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Events</Text>
                <View style={{ width: 24 }} />
            </View>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={{ paddingVertical: 16 }}>
                    <TodaySection data={todayslist} />
                    <View style={styles.upcomingHeader}>
                        <FontAwesome name='calendar-minus-o' size={20} color={theme.text} />
                        <Text style={styles.upcomingTitle}>Upcoming Events</Text>
                    </View>

                    {groupedEvents.map((dateGroup, index) => (
                        <DateGroupSection key={index} dateGroup={dateGroup} />
                    ))}

                    {groupedEvents.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No upcoming events</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
            >
                <Feather name='plus' size={28} color='#FFFFFF' />
            </TouchableOpacity>
            <AddEventModal
                visible={modalVisible}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                editingEvent={editingEvent}
            />
            <ConfirmModal
                visible={confirmVisible}
                onCancel={() => setConfirmVisible(false)}
                onConfirm={handleDeleteConfirm}
            />
        </View>
    );
};

export default Event;

const createStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        scroll: {
            flex: 1,
            backgroundColor: theme.background,
        },
        header: {
            height: 56,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.background,
            paddingHorizontal: 16,
            elevation: 4,
        },
        headerTitle: {
            fontSize: 16,
            fontFamily: Fonts.InterBold,
            color: theme.text,
        },
        section: {
            marginTop: GlobalStyles.margin.medium
        },
        sectionHeader: {
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center'
        },
        sectionTitle: {
            fontSize: 18,
            fontFamily: Fonts.InterBold,
            color: theme.text,
            marginLeft: GlobalStyles.margin.small,
        },
        upcomingHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginTop: 8,
        },
        upcomingTitle: {
            fontSize: 18,
            fontFamily: Fonts.InterBold,
            color: theme.text,
            marginLeft: GlobalStyles.margin.small
        },
        dateHeader: {
            paddingHorizontal: 16,
            marginTop: 4,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        dateTitle: {
            fontSize: 12,
            fontFamily: Fonts.InterSemiBold,
            color: theme.subText,
        },
        horizontalList: {
            paddingHorizontal: 16,
        },
        emptyContainer: {
            padding: 22,
            alignItems: 'center',
            width: GlobalStyles.windowWidth / 1.5,
            height: GlobalStyles.windowHeight / 4,
            alignSelf: "center",
            justifyContent: 'center',
            marginTop: GlobalStyles.margin.medium,
            borderRadius: GlobalStyles.borderRadius.medium,
            backgroundColor: theme.border
        },
        emptyText: {
            fontSize: 14,
            color: theme.subText,
            fontFamily: Fonts.InterRegular
        },
        loaderContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.background,
        },
        fab: {
            position: 'absolute',
            right: 20,
            bottom: 70,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: theme.secandprimary || '#3B82F6',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
        }
    });
