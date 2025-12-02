import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useTheme } from '../../../../contexts/ThemeProvider';
import { moderateScale } from 'react-native-size-matters';
import GlobalStyles from '../../../../styles/GlobalStyles';
import Fonts from '../../../../styles/GlobalFonts';


const barData = [
    { value: 30 },
    { value: 20 },
    { value: 25 },
    { value: 18 },
    { value: 20 },
];


const ChartComponent = ({ stats, impression, selectedValue }) => {
    const { theme } = useTheme();
    const styles = style(theme);

    return (
        <View style={styles.chartContainer}>
            <Text style={styles.title}>{selectedValue} Summary</Text>
            {/* <BarChart
                data={barData.map(item => ({
                    ...item,
                    onPress: null,  
                }))}
                height={120}
                barWidth={30}
                spacing={22}
                barBorderTopLeftRadius={3}
                barBorderTopRightRadius={3}
                hideRules
                hideYAxisText
                yAxisThickness={0}
                xAxisThickness={0}
                noOfSections={4}
                frontColor={theme.secandprimary}
                yAxisTextStyle={{ color: 'gray' }}
                xAxisLabelTextStyle={{ color: 'gray', fontSize: 12 }}
            /> */}
            <View style={styles.rowView}>
                <View style={styles.weekCard}>
                    <Text style={{ fontSize: moderateScale(12), fontFamily: Fonts.InterMedium, color: theme.subText }}>This Week</Text>
                    <Text style={styles.bigText}>{stats.thisPeriod}%</Text>
                </View>
                <View style={[styles.weekCard, { backgroundColor: `${theme.primary}40`, borderColor: theme.primary }]}>
                    <Text style={{ fontSize: moderateScale(12), fontFamily: Fonts.InterMedium, color: theme.subText }}>Last Week</Text>
                    <Text style={[styles.bigText, {color:theme.primary}]}>{stats.lastPeriod}%</Text>
                </View>
                <View style={styles.bottomRow}>
                    <Text style={{ fontSize: moderateScale(12), fontFamily: Fonts.InterMedium, color: theme.subText }}>Total Impression</Text>
                    <Text style={styles.bigText}> {Number(impression.count).toLocaleString('en-US')}</Text>
                    <Text style={styles.smallText}>
                        <Text style={{
                            color: impression.change >= 0
                                ? "#27AE60"
                                : "#EB5757", fontFamily: Fonts.InterMedium, fontSize: 10
                        }}>{impression.change}% </Text> vs last peroid
                    </Text>
                </View>
            </View>
        </View>
    );
};

const style = (theme) => StyleSheet.create({
    chartContainer: {
        backgroundColor: theme.background,
        borderRadius: 12,
        marginTop: GlobalStyles.margin.large
    },
    title: {
        fontSize: moderateScale(15),
        fontFamily: Fonts.InterSemiBold,
        color: theme.text
    },
    bottomRow: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.secandprimary,
        padding: 10,
        width: GlobalStyles.windowWidth / 2.8,
        borderRadius: 10,
        backgroundColor: `${theme.secandprimary}40`
    },
    weekCard: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.secandprimary,
        width: GlobalStyles.windowWidth / 4,
        borderRadius: 10,
        backgroundColor: `${theme.secandprimary}40`,
        justifyContent: "center"
    },
    bigText: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterSemiBold,
        color: theme.secandprimary
    },
    smallText: {
        fontSize: moderateScale(11),
        fontFamily: Fonts.InterRegular,
        color: theme.subText

    },
    rowView:{
        flexDirection: 'row',
         justifyContent: "space-around",
          marginVertical:10
    }
});

export default ChartComponent;



