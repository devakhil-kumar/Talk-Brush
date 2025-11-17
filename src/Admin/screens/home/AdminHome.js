import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LineChartComponent from '../../../Admin/screens/home/components/LineChartComponent'
import { useTheme } from "../../../contexts/ThemeProvider";
import WeeklyStatisticsChart from './components/WeeklyStatisticsChart';



const AdminHome = () => {
    const { theme } = useTheme();
    const styles = style(theme)

    return (
        // <SafeAreaView style={styles.main}>
            <ScrollView>
                <View style={styles.innerMain}>
                    <View style={styles.statsContainer}>
                        <View style={[styles.card, { backgroundColor: theme.secandprimary }]}>
                            <Text style={styles.cardTitle}>Conversations Today</Text>
                            <View style={styles.progessTabs}>
                                <Text style={styles.cardValue}>7,46</Text>
                                <Text style={styles.cardChange}>↑ 11.01%</Text>
                            </View>
                        </View>
                        <View style={[styles.card, { backgroundColor: theme.primary }]}>
                            <Text style={styles.cardTitle}>Total Active Users</Text>
                            <View style={styles.progessTabs}>
                                <Text style={styles.cardValue}>7,265</Text>
                                <Text style={styles.cardChange}>↑ 11.01%</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={[styles.card, { backgroundColor: theme.primary }]}>
                            <Text style={styles.cardTitle}>Total Admins</Text>
                            <View style={styles.progessTabs}>
                                <Text style={styles.cardValue}>7,46</Text>
                                <Text style={styles.cardChange}>↑ 11.01%</Text>
                            </View>
                        </View>

                        <View style={[styles.card, { backgroundColor: theme.secandprimary }]}>
                            <Text style={styles.cardTitle}>Avg. Conv. Time</Text>
                            <View style={styles.progessTabs}>
                                <Text style={styles.cardValue}>7,265</Text>
                                <Text style={styles.cardChange}>↑ 11.01%</Text>
                            </View>
                        </View>
                    </View>
                    <LineChartComponent />
                    <WeeklyStatisticsChart />
                </View>
            </ScrollView>
        // </SafeAreaView >
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
    }
})