import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DATA = [
    {
        id: '1',
        title: 'Changed the style.',
        time: '10 hours ago',
        color: '#8B5CF6',
        image: 'https://via.placeholder.com/32/8B5CF6/FFFFFF?text=1',
    },
    {
        id: '2',
        title: 'Released a new version.',
        time: '15 minutes ago',
        color: '#10B981',
        image: 'https://via.placeholder.com/32/10B981/FFFFFF?text=2',
    },
    {
        id: '3',
        title: 'Submitted a bug.',
        time: '2 hours ago',
        color: '#F59E0B',
        image: 'https://via.placeholder.com/32/F59E0B/FFFFFF?text=3',
    },
    {
        id: '4',
        title: 'Modified 4 data in Page X.',
        time: 'today, 11:59 AM',
        color: '#8B5CF6',
        image: 'https://via.placeholder.com/32/8B5CF6/FFFFFF?text=4',
    },
    {
        id: '5',
        title: 'Deleted a page in Project X.',
        time: '23 hours ago',
        color: '#EF4444',
        image: 'https://via.placeholder.com/32/EF4444/FFFFFF?text=5',
    },
];


const Activity = () => {

    const ActivityItem = ({ item, index }) => {
        return (
            <View style={styles.itemContainer}>
                <View style={styles.leftSection}>
                    <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
                        <Image
                            source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                            style={styles.iconImage}
                        />
                    </View>
                    {index < DATA.length - 1 && <View style={styles.connector} />}
                </View>
                <View style={styles.contentSection}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={DATA}
                renderItem={({ item, index }) => (
                    <ActivityItem item={item} index={index} />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

export default Activity;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    listContent: {
        padding: 20,
        paddingTop: 30,
    },
    itemContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    leftSection: {
        alignItems: 'center',
        marginRight: 16,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    iconText: {
        fontSize: 16,
    },
    connector: {
        width: 2,
        flex: 1,
        backgroundColor: '#E5E7EB',
        marginTop: 4,
        marginBottom: 4,
    },
    contentSection: {
        flex: 1,
        paddingTop: 4,
        paddingBottom: 16,
    },
    title: {
        fontSize: 15,
        fontWeight: '500',
        color: '#111827',
        marginBottom: 4,
    },
    time: {
        fontSize: 13,
        color: '#9CA3AF',
    },
});