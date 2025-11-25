import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities } from '../../../app/features/activitiesSlice';
import { moderateScale } from 'react-native-size-matters';
import Fonts from '../../../styles/GlobalFonts';
import MaterialIcons from '@react-native-vector-icons/material-icons';


const NotificationItem = ({ item }) => {
  const iconMap = {
    UPDATE: { name: 'update', color: '#E3F2FD', iconColor: 'blue' },
    DELETE: { name: 'delete', color: '#FFEBEE', iconColor: 'red' },
    CREATE: { name: 'add', color: '#E8F5E9', iconColor: 'green' },
  };

  return (
    <View style={styles.itemContainer}>
      <View style={[
        styles.iconCircle,
        { backgroundColor: iconMap[item.actionType]?.color }
      ]}>
        <MaterialIcons
          name={iconMap[item.actionType]?.name}
          size={18}
          color={iconMap[item.actionType]?.iconColor}
        />
      </View>
      <View style={styles.contentSection}>
        <Text style={styles.title}>{item.description}</Text>
        <Text style={styles.time}>{item.timeAgo}</Text>
      </View>
    </View>
  );
};

const Notification = () => {
  const dispatch = useDispatch();
  const { activities, loading, notifications } = useSelector(state => state.activites);

  useEffect(() => {
    dispatch(fetchActivities());
  }, []);
  return (
    <SafeAreaView style={styles.container} edges={[0, 'bottom']}>
      {loading ? (
        <ActivityIndicator size="large" color="#8B5CF6" style={{ marginTop: 40 }} />
      ) : (
        <View style={{ flex: 1 }}>
          <Text style={styles.header}>Notifications</Text>
          <FlatList
            data={notifications}
            renderItem={({ item, index }) => (
              <NotificationItem item={item} index={index} />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContent,
              notifications.length === 0 && { flex: 1, justifyContent: "center" },
            ]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No Notifications found</Text>
              </View>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  listContent: {
    paddingVertical: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
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
    flex: 1,
  },
  emptyText: {
    fontSize: moderateScale(16),
    color: '#999',
    fontFamily: Fonts.InterRegular
  },
  iconCircle: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop:5
  },

});

export default Notification;