import React from "react";
import { Text, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Box } from "@/components/ui/box";
import { useTheme } from "@/utils/Themes/ThemeProvider";

const screenWidth = Dimensions.get("window").width;

const InvestmentPieChart = () => {
    const { appliedTheme } = useTheme();
    const investmentData = [
        { name: "Stocks", percentage: 40, color: "#FF6384", legendFontColor: appliedTheme === "light" ? "#1F2937" : "#ffff", legendFontSize: 14 },
        { name: "Crypto", percentage: 25, color: "#36A2EB", legendFontColor: appliedTheme === "light" ? "#1F2937" : "#ffff", legendFontSize: 14 },
        { name: "Real Estate", percentage: 20, color: "#FFCE56", legendFontColor: appliedTheme === "light" ? "#1F2937" : "#ffff", legendFontSize: 14 },
        { name: "Bonds", percentage: 10, color: "#4BC0C0", legendFontColor: appliedTheme === "light" ? "#1F2937" : "#ffff", legendFontSize: 14 },
        { name: "Others", percentage: 5, color: "#9966FF", legendFontColor: appliedTheme === "light" ? "#1F2937" : "#ffff", legendFontSize: 14 },
    ];
    return (
        <Box>
            <Text className={`text-xl font-bold text-text-${appliedTheme}`}>My Dashboard</Text>

            <PieChart
                data={investmentData}
                width={screenWidth * 0.9}
                height={220}
                chartConfig={{
                    backgroundGradientFrom: "#1E1E1E",
                    backgroundGradientTo: "#1E1E1E",
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor={"percentage"}
                backgroundColor="transparent"
                paddingLeft="15"
            />
        </Box>
    );
};

export default InvestmentPieChart;
