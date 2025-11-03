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
    title: 'You fixed a bug.',
    time: 'Just now',
    image: 'https://via.placeholder.com/40/6366F1/FFFFFF?text=🐛',
  },
  {
    id: '2',
    title: 'New user registered.',
    time: '59 minutes ago',
    image: 'https://via.placeholder.com/40/10B981/FFFFFF?text=👤',
  },
  {
    id: '3',
    title: 'You fixed a bug.',
    time: '12 hours ago',
    image: 'https://via.placeholder.com/40/6366F1/FFFFFF?text=🐛',
  },
  {
    id: '4',
    title: 'Andi Lane subscribed to you.',
    time: 'Today, 11:59 AM',
    image: 'https://via.placeholder.com/40/8B5CF6/FFFFFF?text=📡',
  },
];

const NotificationItem = ({ item }) => {
  return (
    <View style={styles.itemContainer}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.iconImage}
      />
      <View style={styles.contentSection}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <FlatList
        data={DATA}
        renderItem={({ item }) => (
          <NotificationItem item={item} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    paddingHorizontal: 20,
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
    fontSize: 15,
    fontWeight: '400',
    color: '#111827',
    marginBottom: 4,
  },
  time: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});