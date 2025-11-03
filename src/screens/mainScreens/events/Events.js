import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@react-native-vector-icons/feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebinarCard from './components/WebinarCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../../../app/features/eventSlice';
import { useTheme } from '../../../contexts/ThemeProvider';

const Event = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { theme } = useTheme(); 
    const styles = createStyles(theme);

    const { list, page, loading, todayslist } = useSelector((state) => state.eventlist);

    useEffect(() => {
        dispatch(fetchEvents(1));
    }, [dispatch]);

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
                        renderItem={({ item }) => <WebinarCard item={item} />}
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
                renderItem={({ item }) => <WebinarCard item={item} />}
                keyExtractor={(item, index) => item?._id || index.toString()}
                contentContainerStyle={styles.horizontalList}
                removeClippedSubviews={false}
            />
        </View>
    );

    const groupedEvents = groupEventsByDate(list);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={theme.secandprimary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name='chevron-left' color={theme.text} size={25} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Events</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scroll}>
                <View style={{ paddingVertical: 16 }}>
                    <TodaySection data={todayslist} />

                    {groupedEvents.length > 0 && (
                        <View style={styles.upcomingHeader}>
                            <Text style={styles.upcomingTitle}>Upcoming Events</Text>
                        </View>
                    )}

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
        </SafeAreaView>
    );
};

export default Event;

// ✅ Theme Based Styles
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
            fontWeight: '600',
            color: theme.text,
        },
        section: {
            marginBottom: 24,
        },
        sectionHeader: {
            paddingHorizontal: 16,
            marginBottom: 12,
            marginTop: 16,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.text,
        },
        upcomingHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginBottom: 8,
            marginTop: 8,
        },
        upcomingTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.text,
        },
        dateHeader: {
            paddingHorizontal: 16,
            marginTop: 4,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        dateTitle: {
            fontSize: 12,
            fontWeight: '500',
            color: theme.subText,
        },
        horizontalList: {
            paddingHorizontal: 16,
        },
        emptyContainer: {
            padding: 22,
            alignItems: 'center',
        },
        emptyText: {
            fontSize: 14,
            color: theme.subText,
        },
        loaderContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.background,
        },
    });
