import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatDateTime } from '../../../../units/GlobalFunctions';
// import GlobalStyles from '../../../styles/GlobalStyles';
// import Fonts from '../../../styles/GlobalFonts';

const UserCard = ({ item, onDelete, onEdit }) => {
    const isActive = item.status === 'Active';

    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.leftSection}>
                    <Text style={styles.name}>{item.fullName}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                    <Text style={styles.dateTime}>
                        {formatDateTime(item.lastLogin) || 'Not Login'}
                    </Text>
                </View>

                <View style={styles.rightSection}>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity onPress={() => onEdit(item)}>
                            <Text style={styles.editButton}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onDelete(item._id)}>
                            <Text style={styles.deleteButton}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default UserCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginBottom: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cardContent: { flexDirection: 'row', justifyContent: 'space-between' },
    leftSection: { flex: 1 },
    rightSection: { alignItems: 'flex-end' },
    name: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 6 },
    email: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
    dateTime: { fontSize: 14, color: '#9CA3AF' },
    actionButtons: { marginTop: 16, gap: 8 },
    editButton: { fontSize: 14, color: '#2563EB', fontWeight: '500' },
    deleteButton: { fontSize: 14, color: '#EF4444', fontWeight: '500' },
});
