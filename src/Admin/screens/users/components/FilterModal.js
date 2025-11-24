// components/FilterModal.js
import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import Feather from '@react-native-vector-icons/feather';
import { Dropdown } from 'react-native-element-dropdown';
import Fonts from '../../../../styles/GlobalFonts';
import { useTheme } from '../../../../contexts/ThemeProvider';

const FilterModal = ({ visible, onClose, onApply }) => {
    const { theme } = useTheme();
    const styles = style(theme);

    const [selectedFilter, setSelectedFilter] = useState('fullName');
    const [selectedSort, setSelectedSort] = useState('asc');
    const [itemsPerPage, setItemsPerPage] = useState('20');

    const filterOptions = [
        { label: 'Name', value: 'fullName' },
        { label: 'Email', value: 'email' },
        { label: 'Phone Number', value: 'phoneNumber' },
        { label: 'Last Login', value: 'lastLogin' },
        { label: 'Date Created', value: 'dateCreated' },
    ];

    const sortOptions = [
        { label: 'Ascending (A-Z, Old to New)', value: 'asc' },
        { label: 'Descending (Z-A, New to Old)', value: 'desc' },
    ];

    const itemsOptions = [
        { label: '10', value: '10' },
        { label: '20', value: '20' },
        { label: '50', value: '50' },
        { label: '100', value: '100' },
    ];

    const handleApply = () => {
        onApply({
            sortBy: selectedFilter,
            sortOrder: selectedSort,
            limit: itemsPerPage,
        });
        onClose();
    };

    const handleReset = () => {
        setSelectedFilter('fullName');
        setSelectedSort('asc');
        setItemsPerPage('20');
    };

    const renderItem = (item, selected) => {
        return (
            <View style={[styles.item, selected && styles.selectedItem]}>
                {selected && (
                    <Feather name="check" size={16} color="#fff" style={styles.checkIcon} />
                )}
                <Text style={[styles.textItem, selected && styles.selectedTextItem]}>
                    {item.label}
                </Text>
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.modalContainer}
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Filter Options</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color={theme.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Filter By Dropdown */}
                        <View style={styles.dropdownWrapper}>
                            <Text style={styles.label}>Filter By</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                containerStyle={styles.dropdownContainer}
                                data={filterOptions}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select filter"
                                value={selectedFilter}
                                onChange={item => {
                                    setSelectedFilter(item.value);
                                }}
                                renderItem={(item) => renderItem(item, item.value === selectedFilter)}
                                renderRightIcon={() => (
                                    <Feather name="chevron-down" size={18} color={theme.text} />
                                )}
                            />
                        </View>

                        <View style={styles.dropdownWrapper}>
                            <Text style={styles.label}>Sort By</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                containerStyle={styles.dropdownContainer}
                                data={sortOptions}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select sort order"
                                value={selectedSort}
                                onChange={item => {
                                    setSelectedSort(item.value);
                                }}
                                renderItem={(item) => renderItem(item, item.value === selectedSort)}
                                renderRightIcon={() => (
                                    <Feather name="chevron-down" size={18} color={theme.text} />
                                )}
                            />
                        </View>

                        <View style={styles.dropdownWrapper}>
                            <Text style={styles.label}>Items Per Page</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                containerStyle={styles.dropdownContainer}
                                data={itemsOptions}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select items per page"
                                value={itemsPerPage}
                                onChange={item => {
                                    setItemsPerPage(item.value);
                                }}
                                renderItem={(item) => renderItem(item, item.value === itemsPerPage)}
                                renderRightIcon={() => (
                                    <Feather name="chevron-down" size={18} color={theme.text} />
                                )}
                            />
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                            <Text style={styles.resetButtonText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                            <Text style={styles.applyButtonText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

export default FilterModal;

const style = (theme) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        maxWidth: 450,
        backgroundColor: theme.background || '#fff',
        borderRadius: 16,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: theme.border || '#e0e0e0',
    },
    headerTitle: {
        fontSize: moderateScale(18),
        fontFamily: Fonts.InterSemiBold,
        color: theme.text || '#000',
    },
    content: {
        padding: 20,
    },
    dropdownWrapper: {
        marginBottom: 20,
    },
    label: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterMedium,
        color: theme.text || '#000',
        marginBottom: 8,
    },
    dropdown: {
        height: 50,
        borderColor: theme.border || '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: theme.background || '#fff',
    },
    placeholderStyle: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterRegular,
        color: theme.secondaryText || '#999',
    },
    selectedTextStyle: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterRegular,
        color: theme.text || '#333',
    },
    inputSearchStyle: {
        height: 40,
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterRegular,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    dropdownContainer: {
        borderRadius: 8,
        borderColor: theme.border || '#ddd',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    item: {
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1',
    },
    selectedItem: {
        backgroundColor: '#007AFF',
    },
    textItem: {
        flex: 1,
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterRegular,
        color: '#333',
    },
    selectedTextItem: {
        color: '#fff',
        fontFamily: Fonts.InterMedium,
    },
    checkIcon: {
        marginRight: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: theme.border || '#e0e0e0',
    },
    resetButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.border || '#ccc',
        marginRight: 10,
        alignItems: 'center',
    },
    resetButtonText: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterMedium,
        color: theme.text || '#333',
    },
    applyButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor:theme.secandprimary,
        alignItems: 'center',
    },
    applyButtonText: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterMedium,
        color: '#fff',
    },
});