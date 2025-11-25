import React from 'react';
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


const ChartComponent = () => {
    const { theme } = useTheme();
    const styles = style(theme);

    return (
        <View style={styles.chartContainer}>
            <Text style={styles.title}>Impression</Text>
            <BarChart
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
            />
            <View style={styles.bottomRow}>
                <Text style={styles.bigText}>12.345</Text>
                <Text style={styles.smallText}>
                    <Text style={{ color: '#EB5757', fontWeight: 'bold' }}>5.4%</Text> than last year
                </Text>
            </View>
        </View>
    );
};

const style = (theme) => StyleSheet.create({
    chartContainer: {
        backgroundColor: theme.background,
        padding: 4,
        borderRadius: 12,
        marginTop: GlobalStyles.margin.large
    },
    title: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterSemiBold,
        color: theme.text
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bigText: {
        fontSize: moderateScale(14),
        fontFamily: Fonts.InterMedium,
        color: theme.text
    },
    smallText: {
        fontSize: moderateScale(11),
        fontFamily: Fonts.InterRegular,
        color: theme.subText

    },
});

export default ChartComponent;



