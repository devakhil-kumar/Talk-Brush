import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import Feather from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts/ThemeProvider';
import Fonts from '../../../styles/GlobalFonts';

const data = [
    { label: 'Apple', value: '1' },
    { label: 'Banana', value: '2' },
    { label: 'Mango', value: '3' },
    { label: 'Orange', value: '4' },
    { label: 'Apple', value: '5' },
    { label: 'Banana', value: '6' },
    { label: 'Mango', value: '7' },
    { label: 'Orange', value: '8' },
];
const Delete = () => {
    const navigation = useNavigation();
    const [text, onChangeText] = React.useState('');
    const [value, setValue] = useState(null);
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const styles = style(theme);

    return (
        <View style={styles.pageBg}>
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name='chevron-left' color={theme.text} size={25} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Delete My Account</Text>
                <View style={{ width: 24 }} />
            </View>
            <Text style={[styles.mediumText, { color: 'blue', paddingHorizontal: '14%', paddingVertical: 10 }]}>Important</Text>
            <View style={{ height: 1, backgroundColor: 'lightgrey', borderRadius: 100 }} />
            <View style={styles.horizontalBlueBar} />
            <Text style={[styles.smallText, { color: 'grey', marginTop: 30 }]}>Reason for Deletion</Text>
            <Dropdown
                style={styles.dropdownConatiner}
                data={data}
                labelField="label"
                valueField="value"
                placeholder="Choose an option"
                value={value}
                onChange={item => setValue(item.value)}
                renderRightIcon={() => (
                    <MaterialIcons name="arrow-drop-down" color="black" size={28} />
                )}
            />
            <Text style={[styles.smallText, { color: 'grey', marginTop: 10 }]}>Other</Text>
            <TextInput
                multiline
                style={styles.textInputStyle}
                numberOfLines={5}
                maxLength={300}
                onChangeText={onChangeText}
                value={text}
                placeholder="Enter Reason"
            />
            <TouchableOpacity style={[styles.dropdownConatiner, { marginTop: 50, backgroundColor: 'darkorange', justifyContent: 'center' , alignItems:'center'}]}>
                <Text style={[styles.mediumText, { color: 'white', fontWeight: '500' , marginTop:0}]}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
}
export default Delete;

const style = (theme) =>  StyleSheet.create({
    pageBg: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        paddingVertical: 20,
        paddingHorizontal: 20
    },
    textInputStyle: {
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 5,
        padding: 10,
        borderColor: 'lightgrey',
        textAlignVertical: 'top',
        minHeight: 140,
        fontSize: 16,
        fontWeight: '400',
        color: 'black'
    },
    horizontalBlueBar: {
        height: 5,
        backgroundColor: 'blue',
        borderRadius: 100,
        width: '50%'
    },
    headeingText: {
        fontSize: 20,
        fontWeight: '700',
        color: 'black'
    },
    mediumText: {
        fontSize: 18,
        fontWeight: '700',
        color: 'black',
        marginTop:20
    },
    smallText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'black'
    },
    dropdownConatiner: {
        height: 50,
        backgroundColor: 'lightgrey',
        marginTop: 5,
        width: "100%",
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 30
    },
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.background,
        elevation: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: Fonts.InterBold,
        color: theme.text,
    }
});