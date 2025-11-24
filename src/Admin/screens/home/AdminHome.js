import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LineChartComponent from '../../../Admin/screens/home/components/LineChartComponent'
import { useTheme } from "../../../contexts/ThemeProvider";
import WeeklyStatisticsChart from './components/WeeklyStatisticsChart';
import { GetTalkBrushChart } from "../../../app/features/ChartSlice";
import { useDispatch, useSelector } from "react-redux";
import { moderateScale } from "react-native-size-matters";
import Fonts from "../../../styles/GlobalFonts";
import Feather from "@react-native-vector-icons/feather";
import GlobalStyles from "../../../styles/GlobalStyles";



const AdminHome = () => {
    const { theme } = useTheme();
    const styles = style(theme)
    const dispatch = useDispatch();
    const [selectedValue, setSelectedValue] = useState("Weekly");

    const { chartData, loading, error } = useSelector(
        state => state.chartData
    );

    useEffect(() => {
        dispatch(GetTalkBrushChart(selectedValue === 'Weekly' ? "week" : selectedValue === 'Monthly' ? "month" : "year"));
    }, [selectedValue]);

    const SimpleDropdown = ({ selectedOption, setSelectedOption }) => {
        const [showOptions, setShowOptions] = useState(false);
        // const [selectedOption, setSelectedOption] = useState("Weekly");

        const options = ["Weekly", "Monthly", "Yearly"];

        const handleSelect = (item) => {
            setSelectedOption(item);
            setShowOptions(false);
        };
        // const styles = style();
        return (
            <View style={styles.dropdownWrapper}>
                <View style={styles.container}>
                    <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: 'space-around', paddingHorizontal: 0, width: GlobalStyles.windowWidth / 4,
                        paddingVertical: 4,
                    }}>
                        <Feather name="chevron-down" size={15} color={'black'} />
                        {/* Dropdown Button */}
                        <TouchableOpacity
                            style={styles.dropdownButton}
                            onPress={() => setShowOptions(!showOptions)}
                        >
                            <Text style={styles.dropdownText}>{selectedOption}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Dropdown Options */}
                    {showOptions && (
                        <View style={styles.optionsContainer}>
                            {options.map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={styles.optionItem}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text style={styles.optionText}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}


                    {/* Backdrop overlay */}
                    {showOptions && (
                        <TouchableOpacity
                            style={styles.backdrop}
                            activeOpacity={1}
                            onPress={() => setShowOptions(false)}
                        />
                    )}

                </View>
            </View>
        );
    };


    return (
        // <SafeAreaView style={styles.main}>
        <View style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                <View style={styles.innerMain}>
                    <View style={styles.header}>
                        <Text style={styles.periodText}>{'Select to Change'}</Text>
                        <SimpleDropdown
                            selectedOption={selectedValue}
                            setSelectedOption={setSelectedValue}
                        />
                    </View>
                    <View style={styles.statsContainer}>
                        <View style={[styles.card, { backgroundColor: theme.secandprimary }]}>
                            <Text style={styles.cardTitle}>Conversations Today</Text>
                            <View style={styles.progessTabs}>
                                <Text style={styles.cardValue}>{chartData.conversationsToday}</Text>
                                <Text style={styles.cardChange}>↑0%</Text>
                            </View>
                        </View>
                        <View style={[styles.card, { backgroundColor: theme.primary }]}>
                            <Text style={styles.cardTitle}>Total Active Users</Text>
                            <View style={styles.progessTabs}>
                                <Text style={styles.cardValue}>{chartData.totalActiveUsers}</Text>
                                <Text style={styles.cardChange}>↑0%</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={[styles.card, { backgroundColor: theme.primary }]}>
                            <Text style={styles.cardTitle}>Total Admins</Text>
                            <View style={styles.progessTabs}>
                                <Text style={styles.cardValue}>{chartData.totalAdmins}</Text>
                                <Text style={styles.cardChange}>↑0%</Text>
                            </View>
                        </View>

                        <View style={[styles.card, { backgroundColor: theme.secandprimary }]}>
                            <Text style={styles.cardTitle}>Avg. Conv. Time</Text>
                            <View style={styles.progessTabs}>
                                <Text style={styles.cardValue}>{chartData.avgConversationTime}</Text>
                                <Text style={styles.cardChange}>↑0%</Text>
                            </View>
                        </View>
                    </View>
                    <LineChartComponent />
                    <WeeklyStatisticsChart chartData={chartData.statistics} selectedValue={selectedValue} stats={chartData.stats} />
                </View>
            </ScrollView>
        </View>
    )
}

export default AdminHome;

const style = (theme) => StyleSheet.create({
    main: {
        flex: 1
    },
    innerMain: {
        padding: 16,
        flex: 1,
        backgroundColor: theme.background
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        marginTop: 10,
    },
    card: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginHorizontal: 6,
        justifyContent: 'center'
    },
    cardTitle: {
        color: '#fff',
        fontSize: 12,
        marginBottom: 6,
    },
    cardValue: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardChange: {
        color: '#fff',
        fontSize: 10,
        marginTop: 4,
    },
    chartSection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        marginTop: 10,
    },
    chartTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 10,
    },
    impressionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    impressionValue: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    impressionChange: {
        color: 'red',
        fontSize: 12,
    },
    weeklyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    weeklyBox: {
        alignItems: 'center',
    },
    weeklyLabel: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 4,
    },
    weeklyValue: {
        fontSize: 16,
        color: '#4B7BE5',
        fontWeight: 'bold',
    },
    weeklyValueYellow: {
        fontSize: 16,
        color: '#FFD166',
        fontWeight: 'bold',
    },
    progessTabs: {
        flexDirection: 'row', justifyContent: 'space-between', marginTop: 10
    },
    header: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'space-between',
    },
    periodText: {
        fontSize: moderateScale(16),
        color: 'black',
        fontFamily: Fonts.InterSemiBold
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 1,
        zIndex: 1001
        // paddingHorizontal: 20,
        // paddingVertical: 4,

    },
    dropdownButton: {
        // borderWidth: 1,
        // borderColor: "#ccc",
        // paddingHorizontal: 8,
        // paddingVertical: 4,
        // borderRadius: 8,
        // backgroundColor: "#fff",
    },

    dropdownText: {
        fontSize: moderateScale(15),
        fontFamily: Fonts.InterRegular,
        color: "#333",
    },

    optionsContainer: {

        // borderWidth: 1,
        // borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "#fff",
        zIndex: 1002,
          position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,

    },

    optionItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f1f1",
    },

    optionText: {
        fontSize: 15,
        color: "#333",
    },
    dropdownWrapper: {
        position: 'relative',
        zIndex: 1000,
    },
      backdrop: {
        position: 'absolute',
        top: 0,
        left: -1000,
        right: -1000,
        bottom: -1000,
        zIndex: 999,
    }

})