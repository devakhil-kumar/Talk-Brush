import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import {
    ProgressChart,
} from "react-native-chart-kit";
import { Dimensions } from "react-native";
import React, { useState } from 'react';

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo } from 'react';
import { GetAnalyticsScreenData } from '../../../app/features/AnalyticsSlice';
import { useTheme } from '../../../contexts/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlobalStyles from '../../../styles/GlobalStyles';
import { moderateScale } from 'react-native-size-matters';
import Fonts from '../../../styles/GlobalFonts';


const screenWidth = Dimensions.get("window").width;

const chartConfig = {
    backgroundGradientFrom: "white",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "white",
    backgroundGradientToOpacity: 0,
    color: (opacity = 0) => `rgba(00, 00, 255, ${opacity})`,
    strokeWidth: 5,
    barPercentage: 0.2,
};

const durations = ['12 Months', '30 days', '7 days', '24 hours'];

const AnalyticsScreen = () => {
    const [selected, setSelected] = useState('12 Months');
    const { theme } = useTheme();
    const styles = style(theme)
    const dispatch = useDispatch();
    const { analyticsData, loading, error } = useSelector(
        state => state.analyticsData
    );

    useEffect(() => {
        dispatch(GetAnalyticsScreenData(selected === '24 hours' ? 'yesterday' : selected === '7 days' ? 'week' : selected === '30 days' ? 'month' : 'year'));
    }, [selected]);

    const getChartData = () => {
        if (!analyticsData?.data || !Array.isArray(analyticsData.data)) {
            return [];
        }

        const maxValue = Math.max(...analyticsData.data.map(d => d.count || 0));
        if (maxValue === 0) return [];

        return analyticsData.data.map(item => ({
            label: item.label || '',
            count: item.count || 0,
            percentage: (item.count / maxValue) * 100
        }));
    };

    const chartData = getChartData();

    return (
        <View style={styles.pageBg} >
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                <View style={styles.barChartContainer}>
                    <Text style={[styles.mediumText, { fontFamily: Fonts.InterSemiBold, fontSize: moderateScale(16) }]}>
                        Conversations per day/week/month
                    </Text>

                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        style={{
                            width: screenWidth * 0.9,
                            // height: 40,
                            // marginBottom: 20,
                            // backgroundColor:'red'
                        }}
                        horizontal={true}
                        data={durations}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                            const isSelected = selected === item;
                            return (
                                <TouchableOpacity
                                    onPress={() => setSelected(item)}
                                    activeOpacity={0.8}
                                    style={[
                                        styles.itemContainer,
                                        isSelected && styles.selectedItem,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.smallText,
                                            isSelected && { color: theme.secandprimary }
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
                    />

                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size={'large'} color={theme.secandprimary} />
                        </View>
                    )}

                    {!loading && chartData.length > 0 && (
                        <View style={styles.chartWrapper}>
                            {chartData.map((data, index) => (
                                <View key={index} style={styles.barRow}>
                                    <Text style={styles.barLabel}>{data.label}</Text>
                                    <View style={styles.barContainer}>
                                        <View
                                            style={[
                                                styles.bar,
                                                { width: `${data.percentage}%` }
                                            ]}
                                        />
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {!loading && chartData.length === 0 && !error && (
                        <View style={styles.loadingContainer}>
                            <Text style={[styles.smallText, { color: '#999' }]}>
                                No data available for the selected period
                            </Text>
                        </View>
                    )}

                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.pieChartContainer}>
                    <Text style={[styles.mediumText, { fontFamily: Fonts.InterSemiBold, fontSize: moderateScale(16) }]}>
                        Active users vs inactive users ratio
                    </Text>

                    <ProgressChart
                        data={{
                            data: [
                                analyticsData?.activeUsers && analyticsData?.totalUsers
                                    ? analyticsData.activeUsers / analyticsData.totalUsers
                                    : 0
                            ]
                        }}
                        width={screenWidth * 0.8}
                        height={250}
                        strokeWidth={40}
                        radius={80}
                        chartConfig={chartConfig}
                        hideLegend={true}
                    />

                    <View style={[styles.rowTextStyle, { justifyContent: 'space-between', paddingHorizontal: 40, marginBottom: 5 }]}>
                        <View style={styles.rowTextStyle}>
                            <View style={{ height: 15, width: 15, backgroundColor: 'blue', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ height: 10, width: 10, backgroundColor: 'white', borderRadius: 100, }} />
                            </View>
                            <Text style={[styles.mediumText, { paddingStart: 10 }]}>Active</Text>
                        </View>
                        <Text style={styles.smallText}>
                            {analyticsData?.activeUsers && analyticsData?.totalUsers
                                ? Math.round((analyticsData.activeUsers / analyticsData.totalUsers) * 100)
                                : 0}%
                        </Text>
                    </View>

                    <View style={[styles.rowTextStyle, { justifyContent: 'space-between', paddingHorizontal: 40 }]}>
                        <View style={styles.rowTextStyle}>
                            <View style={{ height: 15, width: 15, backgroundColor: 'skyblue', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ height: 10, width: 10, backgroundColor: 'white', borderRadius: 100, }} />
                            </View>
                            <Text style={[styles.mediumText, { paddingStart: 10 }]}>Inactive</Text>
                        </View>
                        <Text style={styles.smallText}>
                            {analyticsData?.inactiveUsers && analyticsData?.totalUsers
                                ? Math.round((analyticsData.inactiveUsers / analyticsData.totalUsers) * 100)
                                : 0}%
                        </Text>
                    </View>
                    <View style={[styles.rowTextStyle, { justifyContent: 'space-between', paddingHorizontal: 40 }]}>
                        <View style={styles.rowTextStyle}>
                            <View style={{ height: 15, width: 15, backgroundColor: '#c4b5fd', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ height: 10, width: 10, backgroundColor: 'white', borderRadius: 100, }} />
                            </View>
                            <Text style={[styles.mediumText, { paddingStart: 10 }]}>Never Logged In</Text>
                        </View>
                        <Text style={styles.smallText}>
                            {analyticsData?.missingLoginUsers && analyticsData?.totalUsers
                                ? Math.round((analyticsData.missingLoginUsers / analyticsData.totalUsers) * 100)
                                : 0}%
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default AnalyticsScreen;

const style = (theme) => StyleSheet.create({
    pageBg: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 5
    },
    selectedItem: {
        borderColor: '#007BFF',
        backgroundColor: '#E8F0FF',
    },
    rowTextStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    itemContainer: {
        height: 30,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 7,
        marginEnd: 5,
        justifyContent: 'space-between',
        marginTop: 10
    },
    pieChartContainer: {
        padding: 16,
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 5
    },
    barChartContainer: {
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 5,
        marginBottom: 20,
        width: screenWidth * 0.9,
        padding: 10,
        minHeight: GlobalStyles.windowHeight / 1.8,
    },
    chartWrapper: {
        flex: 1,
        paddingVertical: 10,
    },
    barRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    barLabel: {
        width: 70,
        fontSize: moderateScale(10),
        color: theme.subText,
    },
    barContainer: {
        flex: 1,
        height: 32,
        backgroundColor: theme.border,
        overflow: 'hidden',
        borderTopEndRadius: 16,
        borderBottomEndRadius: 16
    },
    bar: {
        height: '100%',
        backgroundColor: '#4338ca',
    },
    countText: {
        width: 40,
        fontSize: 12,
        color: '#666',
        textAlign: 'left',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
    },
    errorContainer: {
        padding: 16,
        backgroundColor: '#fee',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fcc',
    },
    errorText: {
        color: '#c00',
        fontSize: 14,
    },
    headingText: {
        fontWeight: '700',
        fontSize: 36,
        color: 'black',
    },
    smallText: {
        fontFamily: Fonts.InterRegular,
        color: theme.subText,
        fontSize: moderateScale(14),
    },
    mediumText: {
        color: theme.text,
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterMedium
    },
});