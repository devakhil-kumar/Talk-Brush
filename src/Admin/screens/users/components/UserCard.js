import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatDateTime } from '../../../../units/GlobalFunctions';
import { useTheme } from '../../../../contexts/ThemeProvider';
import Fonts from '../../../../styles/GlobalFonts';
import { moderateScale } from 'react-native-size-matters';

const UserCard = ({ item, onDelete, onEdit }) => {
    const isActive = item.status === 'Active';
    const { theme } = useTheme();
    const styles = style(theme);

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

const style = (theme) => StyleSheet.create({
    card: {
        backgroundColor:'#fff',
        borderRadius: 8,
        marginBottom: 12,
        padding: 16,
        shadowColor: theme.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: theme.background,
    },
    cardContent: { flexDirection: 'row', justifyContent: 'space-between' },
    leftSection: { flex: 1 },
    rightSection: { alignItems: 'flex-end' },
    name: { fontSize:moderateScale(16), color: theme.text, marginBottom: 6 , fontFamily:Fonts.InterSemiBold},
    email: { fontSize: moderateScale(13), color: theme.placeholder, marginBottom: 4 },
    dateTime: { fontSize: moderateScale(13), color:theme.placeholder },
    actionButtons: { marginTop: 16, gap: 8 },
    editButton: { fontSize: 14, color:theme.secandprimary, fontFamily:Fonts.InterRegular},
    deleteButton: { fontSize: 14, color:theme.error, fontFamily:Fonts.InterRegular},
});
