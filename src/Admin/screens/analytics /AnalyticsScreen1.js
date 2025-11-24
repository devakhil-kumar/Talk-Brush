import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import {
    ProgressChart,
    StackedBarChart
} from "react-native-chart-kit";
import { Dimensions } from "react-native";
import React, { useState } from 'react';
import { BarChart } from "react-native-gifted-charts";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo } from 'react';
import { GetAnalyticsScreenData } from '../../../app/features/AnalyticsSlice';
import { useTheme } from '../../../contexts/ThemeProvider';


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
    const theme = useTheme();
    const dispatch = useDispatch();
    const { analyticsData, loading, error } = useSelector(
        state => state.analyticsData
    );
    useEffect(() => {
        dispatch(GetAnalyticsScreenData(selected === '24 hours' ? 'yesterday' : selected === '7 days' ? 'week' : selected === '30 days' ? 'month' : 'year'));
    }, [selected]);
    const formattedStackData = useMemo(() => {
        if (!analyticsData?.data || !Array.isArray(analyticsData.data)) {
            return [];
        }
        return analyticsData.data.map((item) => ({
            label: item.label || '',
            stacks: [
                {
                    value: item.count || 0,
                    color: '#3340C4',
                }
            ],
        }));
    }, [analyticsData?.data, selected]);

    const chartKey = useMemo(() => {
        const dataHash = analyticsData?.data
            ? analyticsData.data.map(d => d.label + d.count).join('|')
            : 'empty';
        return `${selected}-${dataHash}`;
    }, [analyticsData?.data]);

    return (
        <View style={styles.pageBg}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                <View style={styles.barChartContainer}>
                    <Text style={[styles.smallText, { marginBottom: 10 }]}>Conversation per day/week/month</Text>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        style={{
                            width: screenWidth * 0.9,
                            height: 40
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
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
                    />

                    <BarChart
                        key={chartKey}
                        stackData={formattedStackData}
                        width={screenWidth * 0.7}
                        height={200}
                        horizontal
                        labelWidth={0}
                        rotateLabel
                        barWidth={25}
                        barBorderTopLeftRadius={6}
                        barBorderTopRightRadius={6}
                        stackBorderTopLeftRadius={6}
                        stackBorderTopRightRadius={6}
                        yAxisThickness={0}
                        xAxisThickness={0}
                        disableScroll={true}
                        barMarginBottom={0}
                        initialSpacing={0}
                        noOfSections={5}
                        isAnimated
                        spacing={10}
                        shiftX={-30}
                        verticalShift={-40}
                        xAxisLabelTextStyle={{
                            fontSize: 10,
                            color: '#000',
                            fontWeight: '400',
                        }}
                        showXAxisIndices={false}
                        showYAxisIndices={false}
                    />
                </View>

                <View style={styles.pieChartContainer}>
                    <Text style={styles.smallText}>Active users vs inactive users ratio</Text>
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
                            <Text style={[styles.smallText, { paddingStart: 10 }]}>Active</Text>
                        </View>
                        <Text style={styles.smallText}>{(analyticsData.activeUsers / analyticsData.totalUsers) * 100}%</Text>
                    </View>
                    <View style={[styles.rowTextStyle, { justifyContent: 'space-between', paddingHorizontal: 40 }]}>
                        <View style={styles.rowTextStyle}>
                            <View style={{ height: 15, width: 15, backgroundColor: 'skyblue', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ height: 10, width: 10, backgroundColor: 'white', borderRadius: 100, }} />
                            </View>
                            <Text style={[styles.smallText, { paddingStart: 10 }]}>Inactive</Text>
                        </View>
                        <Text style={styles.smallText}>{(analyticsData.inactiveUsers / analyticsData.totalUsers) * 100}%</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default AnalyticsScreen;

const styles = StyleSheet.create({
    pageBg: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
    },
    selectedItem: {
        borderColor: '#007BFF',
        backgroundColor: '#E8F0FF',
    },
    rowTextStyle: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
    itemContainer: {
        height: 40,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        marginEnd: 5,
        justifyContent: 'space-between',
    },
    pieChartContainer: { padding: 16, borderWidth: 1, borderColor: 'lightgrey', borderRadius: 5 },
    barChartContainer: {
        borderWidth: 1, borderColor: 'lightgrey', borderRadius: 5, marginBottom: 20, width: screenWidth * 0.9, padding: 15
    },
    headingText: { fontWeight: '700', fontSize: 36, color: 'black', },
    smallText: { fontWeight: '400', color: 'black', fontSize: 14, },
    mediumText: { fontWeight: '500', color: 'black', fontSize: 24, },
});