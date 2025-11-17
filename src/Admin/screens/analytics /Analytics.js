import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import {
    ProgressChart,
} from "react-native-chart-kit";
import { Dimensions } from "react-native";
import React, { useState } from 'react';
import { BarChart } from "react-native-gifted-charts";

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

const data = {
    data: [0.6]
};
const chartDataByDuration = {
    '12 Months': [
        {
            label: 'Test1',
            stacks: [
                { value: 40, color: 'rgba(103, 119, 255)' },
                { value: 40, color: 'rgba(103, 119, 255, 0.7)' },
            ],
        },
        {
            label: 'Test2',
            stacks: [
                { value: 30, color: 'rgba(103, 119, 255)' },
                { value: 30, color: 'rgba(103, 119, 255, 0.5)' },
            ],
        },
        {
            label: 'Test3',
            stacks: [
                { value: 50, color: 'rgba(103, 119, 255)' },
                { value: 40, color: 'rgba(103, 119, 255, 0.7)'},
                { value: 30, color: 'rgba(103, 119, 255, 0.4)'},
            ],
        },
        {
            label: 'Test4',
            stacks: [
                { value: 40, color: 'rgba(103, 119, 255)'},
                { value: 30, color: 'rgba(103, 119, 255, 0.7)'},
            ],
        },
    ],

    '30 days': [
        {
            label: 'Test1',
            stacks: [
                { value: 25, color: '#4B7BEC' },
                { value: 25, color: '#A5B1C2' },
            ],
        },
        {
            label: 'Test2',
            stacks: [
                { value: 20, color: '#20BF6B' },
                { value: 20, color: '#FD7272' },
            ],
        },
        {
            label: 'Test3',
            stacks: [
                { value: 30, color: '#45AAF2' },
                { value: 30, color: '#778CA3' },
            ],
        },
        {
            label: 'Test4',
            stacks: [
                { value: 20, color: '#FD7272' },
                { value: 15, color: '#4B7BEC' },
            ],
        },
    ],

    '7 days': [
        {
            label: 'Test1',
            stacks: [
                { value: 15, color: '#4B7BEC' },
                { value: 10, color: '#A5B1C2' },
            ],
        },
        {
            label: 'Test2',
            stacks: [
                { value: 25, color: '#20BF6B' },
                { value: 20, color: '#FD7272' },
            ],
        },
        {
            label: 'Test3',
            stacks: [
                { value: 30, color: '#45AAF2' },
                { value: 25, color: '#778CA3' },
            ],
        },
        {
            label: 'Test4',
            stacks: [
                { value: 15, color: '#FD7272' },
                { value: 5, color: '#4B7BEC' },
            ],
        },
    ],

    '24 hours': [
        {
            label: 'Test1',
            stacks: [
                { value: 10, color: '#4B7BEC' },
                { value: 5, color: '#A5B1C2' },
            ],
        },
        {
            label: 'Test2',
            stacks: [
                { value: 15, color: '#20BF6B' },
                { value: 10, color: '#FD7272' },
            ],
        },
        {
            label: 'Test3',
            stacks: [
                { value: 20, color: '#45AAF2' },
                { value: 15, color: '#778CA3' },
            ],
        },
        {
            label: 'Test4',
            stacks: [
                { value: 10, color: '#FD7272' },
                { value: 5, color: '#4B7BEC' },
            ],
        },
    ],
};

const durations = ['12 Months', '30 days', '7 days', '24 hours'];

export default function AnalyticsScreen() {
    const [selected, setSelected] = useState('12 Months');
    const graphData = chartDataByDuration[selected];

    return (
        <View style={styles.pageBg}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.barChartContainer,]}>
                    <Text style={[styles.smallText, { marginBottom: 10 }]}>Conversation per day/week/month</Text>
                    <FlatList
                        style={{
                            width: screenWidth * 0.8,
                            height: 60
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
                        stackData={graphData}
                        width={screenWidth * 0.7}
                        height={200}
                        horizontal
                        barWidth={40}
                        stackBorderTopLeftRadius={3}
                        stackBorderTopRightRadius={3}
                        yAxisThickness={0}
                        xAxisThickness={0}
                        barMarginBottom={10}
                        initialSpacing={0}
                        noOfSections={4}
                        isAnimated
                        spacing={10}
                        shiftX={-30}
                        disableScroll={true}
                        verticalShift={-50}
                    />
                </View>

                {/* pie chart */}
                <View style={styles.pieChartContainer}>
                    <Text style={styles.smallText}>Active users vs inactive users ratio</Text>
                    <ProgressChart
                        data={data}
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
                        <Text style={styles.smallText}>60%</Text>
                    </View>
                    <View style={[styles.rowTextStyle, { justifyContent: 'space-between', paddingHorizontal: 40 }]}>
                        <View style={styles.rowTextStyle}>
                            <View style={{ height: 15, width: 15, backgroundColor: 'skyblue', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ height: 10, width: 10, backgroundColor: 'white', borderRadius: 100, }} />
                            </View>
                            <Text style={[styles.smallText, { paddingStart: 10 }]}>Inactive</Text>
                        </View>
                        <Text style={styles.smallText}>40%</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

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
        paddingHorizontal: 10,
        marginEnd: 5,
        justifyContent: 'space-between',
    },
    pieChartContainer: { padding: 16, borderWidth: 1, borderColor: 'lightgrey', borderRadius: 5 },
    barChartContainer: { padding: 16, borderWidth: 1, borderColor: 'lightgrey', borderRadius: 5, marginBottom: 20 },
    headingText: { fontWeight: '700', fontSize: 36, color: 'black', },
    smallText: { fontWeight: '400', color: 'black', fontSize: 14, },
    mediumText: { fontWeight: '500', color: 'black', fontSize: 24, },
});