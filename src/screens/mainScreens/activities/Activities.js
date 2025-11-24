import React, { useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    ActivityIndicator,
    Platform
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities, fetchUserActivities } from '../../../app/features/activitiesSlice'; // update path if needed
import { moderateScale } from 'react-native-size-matters';
import Fonts from '../../../styles/GlobalFonts';

const Activity = () => {

    const dispatch = useDispatch();
    const { activities, loading, data } = useSelector(state => state.activites);
    console.log(data, 'data +++++++++++')
    const insets = useSafeAreaInsets();
    const bottomInset = Platform.OS === 'android' ? insets.bottom : 10;
    const { userRole } = useSelector((state) => state.auth);



    useEffect(() => {
        if (userRole === "2") {
            dispatch(fetchActivities());
        } else if (userRole === "3") {
            dispatch(fetchUserActivities());
        }
    }, []);
    const listData = userRole === "2" ? activities : data;


    const ActivityItem = ({ item, index }) => {
        return (
            <View style={styles.itemContainer}>
                <View style={styles.leftSection}>
                    <View style={[styles.iconCircle, { backgroundColor: "#8B5CF6" }]}>
                        <Image
                            source={{ uri: "https://via.placeholder.com/32/8B5CF6/FFFFFF?text=A" }}
                            style={styles.iconImage}
                        />
                    </View>
                    {index < activities.length - 1 && <View style={styles.connector} />}
                </View>

                <View style={styles.contentSection}>
                    <Text style={styles.title}>{item.description}</Text>
                    <Text style={styles.time}>{item.timeAgo}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { paddingBottom: bottomInset }]} edges={[0, 'bottom']}>
            {loading ? (
                <ActivityIndicator size="large" color="#8B5CF6" style={{ marginTop: 40 }} />
            ) : (
                <View>
                    <Text style={styles.header}>Activities</Text>
                    <FlatList
                        data={listData}
                        renderItem={({ item, index }) => (
                            <ActivityItem item={item} index={index} />
                        )}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No activities found</Text>
                            </View>
                        )}
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

export default Activity;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    listContent: {
        marginTop: 20
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
    iconImage: {
        width: 16,
        height: 16,
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
        fontSize: moderateScale(15),
        color: '#111827',
        fontFamily: Fonts.InterMedium
    },
    header: {
        fontSize: moderateScale(20),
        fontFamily: Fonts.InterSemiBold,
        color: '#111827',
        marginTop: 0
    },
    time: {
        fontSize: moderateScale(13),
        fontFamily: Fonts.InterRegular,
        color: '#9CA3AF',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },

});
