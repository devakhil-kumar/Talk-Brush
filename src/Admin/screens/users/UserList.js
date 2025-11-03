import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@react-native-vector-icons/feather";
import Ionicons from "@react-native-vector-icons/ionicons";
import { moderateScale } from "react-native-size-matters";
import Fonts from "../../../styles/GlobalFonts";
import ConfirmModal from '../users/components/ConfirmModal';
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, resetList } from "../../../app/features/listSlice";
import { deleteUser } from "../../../app/features/deleteSlice";
import UserCard from '../users/components/UserCard';
import GlobalStyles from "../../../styles/GlobalStyles";

const UserList = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const dispatch = useDispatch();
    const { list, loading, page, hasMore } = useSelector((state) => state.userlist);

    useEffect(() => {
        dispatch(resetList());
        dispatch(fetchUsers(1));
    }, []);

    const loadMoreUsers = () => {
        if (!loading && hasMore) {
            dispatch(fetchUsers(page + 1));
        }
    };

    const renderFooter = () => {
        if (!loading) return null;
        return <ActivityIndicator size={30} color={'#7063F1'} />;
    };

    const handleDelete = (userId) => {
        setSelectedUserId(userId);
        setModalVisible(true);
    };

    const handleEdit = (user) => {
        console.log("Edit user:", user);
    };

    return (
        <SafeAreaView style={style.main}>
            <View style={style.innerCantainer}>
                <View style={style.topButtonsRow}>
                    <TouchableOpacity style={style.filterBtn}>
                        <Ionicons name="filter" color={'#0000'} size={16} />
                        <Text style={style.filterText}>Filters</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.exportBtn}>
                        <Feather name="download-cloud" color={'#0000'} size={16} />
                        <Text style={style.exportText}>Export</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.addUserBtn}>
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
        </SafeAreaView>
    );
};

export default UserList;

const style = StyleSheet.create({
    main: { flex: 1 },
    innerCantainer: { flex: 1, paddingHorizontal: GlobalStyles.padding.medium },
    topButtonsRow: { flexDirection: "row", marginTop: GlobalStyles.margin.medium, alignItems: 'center' },
    filterBtn: { flexDirection: 'row', padding: 4 },
    filterText: { fontSize: moderateScale(14), fontFamily: Fonts.PoppinsRegular, marginLeft: GlobalStyles.margin.small },
    exportBtn: { flexDirection: 'row', padding: 7, borderWidth: 1, borderRadius: GlobalStyles.borderRadius.small, borderColor: '#D0D5DD', marginLeft: GlobalStyles.margin.medium },
    exportText: { fontSize: moderateScale(14), fontFamily: Fonts.PoppinsRegular, marginLeft: GlobalStyles.margin.small },
    addUserBtn: { flexDirection: 'row', backgroundColor: '#3340C4', borderRadius: GlobalStyles.borderRadius.small, alignItems: "center", padding: 12, marginLeft: GlobalStyles.margin.medium },
    addUserText: { fontSize: moderateScale(14), fontFamily: Fonts.PoppinsRegular, marginLeft: GlobalStyles.margin.small, lineHeight: moderateScale(15), color: '#fff' },
    listWrapper: { marginTop: GlobalStyles.margin.large, marginBottom: GlobalStyles.margin.large * 3.8 },
    listContent: { paddingBottom: GlobalStyles.margin.large }
});
