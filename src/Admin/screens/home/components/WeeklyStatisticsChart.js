import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { moderateScale } from 'react-native-size-matters';
import { useTheme } from '../../../../contexts/ThemeProvider';
import Fonts from '../../../../styles/GlobalFonts';
import GlobalStyles from '../../../../styles/GlobalStyles';

const thisWeekData = [
    { value: 15, label: 'Mon' },
    { value: 7, label: 'Tue' },
    { value: 6, label: 'Wed' },
    { value: 10, label: 'Thu' },
    { value: 8, label: 'Fri' },
    { value: 11, label: 'Sat' },
    { value: 9, label: 'Sun' },
];
const lastWeekData = [
    { value: 4 },
    { value: 6 },
    { value: 5 },
    { value: 8 },
    { value: 6 },
    { value: 9 },
    { value: 7 },
];

const WeeklyStatisticsChart = () => {

    const { theme } = useTheme();
    const styles = style(theme);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.periodText}>Weekly</Text>
            </View>
            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <Text style={styles.thisWeekLabel}>This Week</Text>
                    <Text style={[styles.percent, { color: theme.secandprimary }]}>+20%</Text>
                </View>
                <View style={styles.legendItem}>
                    <Text style={styles.lastWeekLabel}>Last Week</Text>
                    <Text style={[styles.percent, { color: theme.primary }]}>+13%</Text>
                </View>
            </View>
            <Text style={styles.statTitle}>Statistic</Text>
            <LineChart
                data={thisWeekData}
                data2={lastWeekData}
                color1="#4B7BE5"
                color2="#F5A623"
                curved
                hideRules={false}
                rulesColor="#E8E8E8"
                showVerticalLines
                verticalLinesColor="#E8E8E8"
                showYAxisIndices={false}
                showXAxisIndices
                yAxisThickness={0}
                xAxisThickness={0}
                hideDataPoints={false}
                dataPointsColor1="#4B7BE5"
                dataPointsColor2="#F5A623"
                dataPointsRadius={3}
                startOpacity={0}
                endOpacity={0}
                initialSpacing={20}
                spacing={40}
                xAxisLabelTextStyle={styles.xAxisLabel}
                hideOrigin
                height={160}
                width={260}
                showScrollIndicator={false}
                scrollAnimation={false}
            />
        </View>
    );
};

const style = (theme) => StyleSheet.create({
    container: {
        backgroundColor: theme.background,
        borderRadius: 16,
        padding: 5,
        marginTop:GlobalStyles.margin.large * 2
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    periodText: {
        fontSize: moderateScale(16),
        fontFamily: Fonts.InterSemiBold,
        color: theme.text
    },
    legendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:GlobalStyles.margin.medium 
    },
    legendItem: {
        marginLeft: 16,
        alignItems: 'center',
    },
    thisWeekLabel: {
        color:theme.subText,
        fontSize:moderateScale(12),
        fontFamily:Fonts.InterRegular
    },
    lastWeekLabel: {
        color:theme.subText,
         fontSize:moderateScale(12),
        fontFamily:Fonts.InterRegular
    },
    percent: {
        fontSize: 12,
        marginTop: 2,
    },
    statTitle: {
        fontSize:moderateScale(14),
        color: theme.subText,
        marginTop:GlobalStyles.margin.large ,
        marginBottom:5,
        fontFamily:Fonts.InterMedium   
     },
    xAxisLabel: {
        color: '#999',
        fontSize: 10,
    },
});

export default WeeklyStatisticsChart;
