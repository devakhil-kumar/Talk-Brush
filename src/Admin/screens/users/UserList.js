import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Platform, Alert, Linking } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@react-native-vector-icons/feather";
import Ionicons from "@react-native-vector-icons/ionicons";
import { moderateScale } from "react-native-size-matters";
import Fonts from "../../../styles/GlobalFonts";
import ConfirmModal from '../users/components/ConfirmModal';
import { useDispatch, useSelector } from "react-redux";
import { editUser, fetchUsers, resetList } from "../../../app/features/listSlice";
import { deleteUser } from "../../../app/features/deleteSlice";
import UserCard from '../users/components/UserCard';
import GlobalStyles from "../../../styles/GlobalStyles";
import AddUserModal from '../users/components/AddUserModal';
import { useTheme } from "../../../contexts/ThemeProvider";
import { registerUser } from "../../../app/features/authSlice";
import { showMessage } from "../../../app/features/messageSlice";
import FilterModal from './components/FilterModal';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import * as XLSX from 'xlsx';

const UserList = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filterOptions, setFilterOptions] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const { theme } = useTheme();
    const style = styles(theme);

    const dispatch = useDispatch();
    const { list, loading, page, hasMore } = useSelector((state) => state.userlist);

    useEffect(() => {
        dispatch(resetList());
        dispatch(fetchUsers({ page: 1, filter: filterOptions }));
    }, [refresh, filterOptions]);

    const loadMoreUsers = () => {
        if (!loading && hasMore) {
            dispatch(fetchUsers({ page: page + 1, filter: filterOptions }));
        }
    };

    const renderFooter = () => {
        if (!loading) return null;
        return <ActivityIndicator size={30} color={'#7063F1'} />;
    };

    if (isloading) {
        return <ActivityIndicator size={30} color={'#7063F1'} />;
    }


    const handleAddUser = async (formData) => {
        setIsLoading(true);
        try {
            const res = await dispatch(registerUser(formData)).unwrap();
            dispatch(showMessage({
                type: 'success',
                text: 'User added successfully',
            }));
            setRefresh(prev => !prev);
            setUserModalVisible(false);
            dispatch(resetList());
        } catch (err) {
            dispatch(showMessage({
                type: 'error',
                text: err?.message || 'Failed to create user',
            }));
        } finally {
            setIsLoading(false)
        }
    };

    const handleEditUser = async (formData) => {
        setIsLoading(true);
        try {
            await dispatch(editUser({
                userId: selectedUser._id,
                userData: formData
            })).unwrap();
            dispatch(showMessage({
                type: 'success',
                text: 'User updated successfully',
            }));
            setRefresh(prev => !prev);
            setUserModalVisible(false);
            setEditMode(false);
            setSelectedUser(null);
        } catch (err) {
            dispatch(showMessage({
                type: 'error',
                text: err?.message || 'Failed to update user',
            }));
        } finally {
            setIsLoading(false);
        }
    };


    const handleExportNonExpo = async () => {
        if (!list || list.length === 0) {
            dispatch(showMessage({
                type: 'error',
                text: 'No users to export',
            }));
            return;
        }
        setExportLoading(true);
        try {
            const exportData = list.map(user => ({
                'Name': user.fullName || 'N/A',
                'Email': user.email || 'N/A',
                'Phone Number': user.phoneNumber || 'N/A',
                'Last Login': user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString()
                    : 'Never',
                'Status': user.status || 'N/A',
                'Role': user.role || 'N/A'
            }));
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Users");
            const wbout = XLSX.write(wb, { type: 'base64', bookType: "xlsx" });
            const fileName = `users_${new Date().toISOString().split('T')[0]}.xlsx`;
            const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;
            await RNFS.writeFile(filePath, wbout, 'base64');
            const shareOptions = {
                title: 'Export Users',
                message: 'Here is the exported users list',
                url: `file://${filePath}`, 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                filename: fileName,
                saveToFiles: true, 
                subject: `Users Export - ${new Date().toLocaleDateString()}`, 
            };
            const result = await Share.open(shareOptions);
            console.log('Share result:', result);
            if (result.dismissedAction) {
                console.log('User cancelled share');
            } else {
                dispatch(showMessage({
                    type: 'success',
                    text: `${list.length} user${list.length > 1 ? 's' : ''} exported successfully!`,
                }));
            }
        } catch (error) {
            if (error.message?.includes('cancelled') || error.message?.includes('dismissed') || error.message?.includes('User did not share')) {
                console.log('User cancelled share – no error toast');
                return;
            }
            if (error.message?.includes('getScheme') || error.message?.includes('NullPointerException')) {
                dispatch(showMessage({
                    type: 'error',
                    text: 'Share failed – try saving via Files app. (Android URI issue)',
                }));
                return;
            }
            dispatch(showMessage({
                type: 'error',
                text: 'Failed to export: ' + (error.message || 'Unknown error'),
            }));
        } finally {
            setExportLoading(false);
        }
    };


    const handleDelete = (userId) => {
        setSelectedUserId(userId);
        setModalVisible(true);
    };

    const handleEdit = (user) => {
        setEditMode(true);
        setSelectedUser(user);
        setUserModalVisible(true);
    };

    const handleCloseModal = () => {
        setUserModalVisible(false);
        setEditMode(false);
        setSelectedUser(null);
    };

    const handleApplyFilters = (filters) => {
        setFilterOptions(filters);
        setFilterModalVisible(false);
    };


    return (
        <View style={style.main}>
            <View style={style.innerCantainer}>
                <View style={style.topButtonsRow}>
                    <TouchableOpacity style={style.filterBtn} onPress={() => setFilterModalVisible(true)} >
                        <Ionicons name="filter" color={theme.text} size={16} />
                        <Text style={style.filterText}>Filters</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={style.exportBtn}
                        onPress={handleExportNonExpo}
                        disabled={exportLoading || list.length === 0}
                    >
                        <Feather name="download-cloud" color={theme.text} size={16} />
                        <Text style={style.exportText}>Export</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.addUserBtn} onPress={() => setUserModalVisible(true)}>
                        <Feather name="plus" color={'#fff'} size={16} />
                        <Text style={style.addUserText}>Add New User</Text>
                    </TouchableOpacity>
                </View>
                <View style={style.listWrapper}>
                    <FlatList
                        data={list}
                        onEndReached={loadMoreUsers}
                        onEndReachedThreshold={0.5}
                        renderItem={({ item }) => (
                            <UserCard item={item} onDelete={handleDelete} onEdit={handleEdit} />
                        )}
                        keyExtractor={(item) => item._id.toString()}
                        contentContainerStyle={style.listContent}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={renderFooter}
                    />
                </View>

                <ConfirmModal
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    onConfirm={() => {
                        dispatch(deleteUser(selectedUserId));
                        setModalVisible(false);
                    }}
                />
            </View>
            <AddUserModal
                visible={userModalVisible}
                onSubmit={editMode ? handleEditUser : handleAddUser}
                onClose={handleCloseModal}
                loading={isloading}
                editMode={editMode}
                userData={selectedUser}
            />
            <FilterModal
                visible={filterModalVisible}
                onClose={() => setFilterModalVisible(false)}
                onApply={handleApplyFilters}
            />
        </View>
    );
};

export default UserList;

const styles = (theme) => StyleSheet.create({
    main: { flex: 1 },
    innerCantainer: { flex: 1, paddingHorizontal: GlobalStyles.padding.medium },
    topButtonsRow: { flexDirection: "row", marginTop: GlobalStyles.margin.medium, alignItems: 'center' },
    filterBtn: { flexDirection: 'row', padding: 4 },
    filterText: { fontSize: moderateScale(14), fontFamily: Fonts.InterRegular, marginLeft: GlobalStyles.margin.small },
    exportBtn: { flexDirection: 'row', padding: 7, borderWidth: 1, borderRadius: GlobalStyles.borderRadius.small, borderColor: theme.border, marginLeft: GlobalStyles.margin.medium },
    exportText: { fontSize: moderateScale(14), fontFamily: Fonts.InterRegular, marginLeft: GlobalStyles.margin.small },
    addUserBtn: { flexDirection: 'row', backgroundColor: theme.secandprimary, borderRadius: GlobalStyles.borderRadius.small, alignItems: "center", padding: 12, marginLeft: GlobalStyles.margin.medium },
    addUserText: { fontSize: moderateScale(14), fontFamily: Fonts.InterRegular, marginLeft: GlobalStyles.margin.small, lineHeight: moderateScale(15), color:'#fff'},
    listWrapper: { marginTop: GlobalStyles.margin.large, marginBottom: GlobalStyles.margin.large * 3.8 },
    listContent: { paddingBottom: GlobalStyles.margin.large },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,          
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
