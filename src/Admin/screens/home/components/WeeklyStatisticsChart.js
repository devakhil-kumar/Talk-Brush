// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { LineChart } from 'react-native-gifted-charts';
// import { moderateScale } from 'react-native-size-matters';
// import { useTheme } from '../../../../contexts/ThemeProvider';
// import Fonts from '../../../../styles/GlobalFonts';
// import GlobalStyles from '../../../../styles/GlobalStyles';

// const thisWeekData = [
//     { value: 15, label: 'Mon' },
//     { value: 7, label: 'Tue' },
//     { value: 6, label: 'Wed' },
//     { value: 10, label: 'Thu' },
//     { value: 8, label: 'Fri' },
//     { value: 11, label: 'Sat' },
//     { value: 9, label: 'Sun' },
// ];
// const lastWeekData = [
//     { value: 4 },
//     { value: 6 },
//     { value: 5 },
//     { value: 8 },
//     { value: 6 },
//     { value: 9 },
//     { value: 7 },
// ];

// const WeeklyStatisticsChart = () => {

//     const { theme } = useTheme();
//     const styles = style(theme);

//     return (
//         <View style={styles.container}>
//             <View style={styles.header}>
//                 <Text style={styles.periodText}>Weekly</Text>
//             </View>
//             <View style={styles.legendContainer}>
//                 <View style={styles.legendItem}>
//                     <Text style={styles.thisWeekLabel}>This Week</Text>
//                     <Text style={[styles.percent, { color: theme.secandprimary }]}>+20%</Text>
//                 </View>
//                 <View style={styles.legendItem}>
//                     <Text style={styles.lastWeekLabel}>Last Week</Text>
//                     <Text style={[styles.percent, { color: theme.primary }]}>+13%</Text>
//                 </View>
//             </View>
//             <Text style={styles.statTitle}>Statistic</Text>
//             <LineChart
//                 data={thisWeekData}
//                 data2={lastWeekData}
//                 color1="#4B7BE5"
//                 color2="#F5A623"
//                 curved
//                 hideRules={false}
//                 rulesColor="#E8E8E8"
//                 showVerticalLines
//                 verticalLinesColor="#E8E8E8"
//                 showYAxisIndices={false}
//                 showXAxisIndices
//                 yAxisThickness={0}
//                 xAxisThickness={0}
//                 hideDataPoints={false}
//                 dataPointsColor1="#4B7BE5"
//                 dataPointsColor2="#F5A623"
//                 dataPointsRadius={3}
//                 startOpacity={0}
//                 endOpacity={0}
//                 initialSpacing={20}
//                 spacing={40}
//                 xAxisLabelTextStyle={styles.xAxisLabel}
//                 hideOrigin
//                 height={160}
//                 width={260}
//                 showScrollIndicator={false}
//                 scrollAnimation={false}
//             />
//         </View>
//     );
// };

// const style = (theme) => StyleSheet.create({
//     container: {
//         backgroundColor: theme.background,
//         borderRadius: 16,
//         padding: 5,
//         marginTop:GlobalStyles.margin.large * 2
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     periodText: {
//         fontSize: moderateScale(16),
//         fontFamily: Fonts.InterSemiBold,
//         color: theme.text
//     },
//     legendContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginTop:GlobalStyles.margin.medium 
//     },
//     legendItem: {
//         marginLeft: 16,
//         alignItems: 'center',
//     },
//     thisWeekLabel: {
//         color:theme.subText,
//         fontSize:moderateScale(12),
//         fontFamily:Fonts.InterRegular
//     },
//     lastWeekLabel: {
//         color:theme.subText,
//          fontSize:moderateScale(12),
//         fontFamily:Fonts.InterRegular
//     },
//     percent: {
//         fontSize: 12,
//         marginTop: 2,
//     },
//     statTitle: {
//         fontSize:moderateScale(14),
//         color: theme.subText,
//         marginTop:GlobalStyles.margin.large ,
//         marginBottom:5,
//         fontFamily:Fonts.InterMedium   
//      },
//     xAxisLabel: {
//         color: '#999',
//         fontSize: 10,
//     },
// });

// export default WeeklyStatisticsChart;
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from 'react';
import { moderateScale } from 'react-native-size-matters';
import Fonts from '../../../../styles/GlobalFonts';
import { useTheme } from '../../../../contexts/ThemeProvider';
import GlobalStyles from '../../../../styles/GlobalStyles';
// import { moderateScale } from 'react-native-size-matters';
// import { useTheme } from '../../../../contexts/ThemeProvider';
// import Fonts from '../../../../styles/GlobalFonts';
// import GlobalStyles from '../../../../styles/GlobalStyles';

// ----------------------
// WEEKLY DATA
// ----------------------
export const thisWeekData = [
    { value: 15, },
    { value: 7, },
    { value: 6, },
    { value: 10, },
    { value: 8, },
    { value: 11, },
    { value: 9, },
];


export const lastWeekData = [
    { value: 4 },
    { value: 6, },
    { value: 5, },
    { value: 8, },
    { value: 6, },
    { value: 9, },
    { value: 7, },
];


// ----------------------
// MONTHLY DATA (4 Weeks)
// ----------------------
export const thisMonthData = [
    55,
    42,
    48,
    68,
];

export const lastMonthData = [
    38,
    50,
    44,
    57
];


// ----------------------
// YEARLY DATA (12 Months)
// ----------------------
export const thisYearData = [
    { value: 30, },
    { value: 25, },
    { value: 28, },
    { value: 35, },
    { value: 40, },
    { value: 38, },
    { value: 45, },
    { value: 42, },
    { value: 39, },
    { value: 50, },
    { value: 47, },
    { value: 55, },
];

export const lastYearData = [
    { value: 22, },
    { value: 20, },
    { value: 25, },
    { value: 33, },
    { value: 36, },
    { value: 34, },
    { value: 29, },
    { value: 44, },
    { value: 40, },
    { value: 48, },
];




const SimpleDropdown = ({ selectedOption, setSelectedOption }) => {
    const [showOptions, setShowOptions] = useState(false);
    // const [selectedOption, setSelectedOption] = useState("Weekly");

    const options = ["Weekly", "Monthly", "Yearly"];

    const handleSelect = (item) => {
        setSelectedOption(item);
        setShowOptions(false);
    };
    const styles = style();
    return (
        <View style={styles.container}>

            {/* Dropdown Button */}
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowOptions(!showOptions)}
            >
                <Text style={styles.dropdownText}>{selectedOption}</Text>
            </TouchableOpacity>

            {/* Dropdown Options */}
            {showOptions && (
                <View style={styles.optionsContainer}>
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.optionItem}
                                onPress={() => handleSelect(item)}
                            >
                                <Text style={styles.optionText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

        </View>
    );
};

export const weekLabels = [
    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
];

export const monthLabelsWeekly = [
    "Week 1",
    "Week 2",
    "Week 3",
    "Week 4"
];

export const yearLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const convertToChartFormat = (array = [], labels = []) => {
    return array.map((val, index) => ({
        value: val,
        label: labels[index] ?? ""
    }));
};

const WeeklyStatisticsChart = ({ chartData, selectedValue, stats }) => {
    const theme = useTheme()
    const styles = style(theme);

    const thisData = convertToChartFormat(chartData?.thisWeekData,
        selectedValue === "Weekly" ? weekLabels : selectedValue === "Monthly" ? monthLabelsWeekly : yearLabels
    );
    const lastData = convertToChartFormat(chartData?.lastWeekData,
        selectedValue === "Weekly" ? weekLabels : selectedValue === "Monthly" ? monthLabelsWeekly : yearLabels);
    return (
        <View style={styles.container}>
            <Text style={styles.periodText}>{selectedValue}</Text>
            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <Text style={styles.thisWeekLabel}>This {selectedValue === 'Weekly' ? "Week" : selectedValue === 'Monthly' ? "Month" : "Year"}</Text>
                    <Text style={[styles.percent,]}>+{stats?.thisPeriod}%</Text>
                </View>
                <View style={styles.legendItem}>
                    <Text style={styles.thisWeekLabel}>Last {selectedValue === 'Weekly' ? 'Week' : selectedValue === 'Monthly' ? "Month" : "Year"}</Text>
                    <Text style={[styles.percent,]}>+{stats?.lastPeriod}%</Text>
                </View>
            </View>
            <Text style={styles.statTitle}>Statistic</Text>
            <LineChart
                data={thisData}
                data2={lastData}
                noOfSections={chartData?.labels?.length - 1}  
                yAxisLabelTexts={chartData?.labels}
                showYAxisIndices={false}
                xAxisLabelTexts={selectedValue === "Weekly" ? weekLabels : selectedValue === "Monthly" ? monthLabelsWeekly : yearLabels}
                color1="#4B7BE5"
                color2="#F5A623"
                curved
                hideRules={false}
                rulesColor="#E8E8E8"
                showVerticalLines
                verticalLinesColor="#E8E8E8"
                showXAxisIndices={false}
                yAxisThickness={0}
                xAxisThickness={0}
                hideDataPoints={false}
                dataPointsColor1="#4B7BE5"
                dataPointsColor2="#F5A623"
                dataPointsRadius={3}
                startOpacity={0}
                endOpacity={0}
                initialSpacing={20}
                spacing={selectedValue === 'Monthly' ? 80 : 40}
                xAxisLabelTextStyle={styles.xAxisLabel}
                hideOrigin
                height={160}
                width={GlobalStyles.windowWidth * 0.9}
                showScrollIndicator={false}
                scrollAnimation={false}
            />

        </View>
    );
};

const style = (theme) => StyleSheet.create({
    container: {
        marginTop: 10
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    periodText: {
        fontSize: moderateScale(16),
        fontFamily: Fonts.InterMedium,
        color: 'black'
    },
    legendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendItem: {
        marginLeft: 16,
        alignItems: 'center',
    },
    thisWeekLabel: {
        color: 'black',
        fontSize: moderateScale(12),
        fontFamily: Fonts.InterMedium,
        marginTop: 10
    },
    lastWeekLabel: {
        color: 'black',
        fontSize: 12
    },
    percent: {
        fontSize: 12,
        marginTop: 2,
    },
    statTitle: {
        fontSize: moderateScale(14),
        color: theme.subText,
        marginTop: GlobalStyles.margin.large,
        marginBottom: 5,
        fontFamily: Fonts.InterMedium
    },
    xAxisLabel: {
        color: '#999',
        fontSize: 10,
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    dropdownText: {
        fontSize: 16,
        color: "#333",
    },
    optionsContainer: {

        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "#fff",

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
});

export default WeeklyStatisticsChart;