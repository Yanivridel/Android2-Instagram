import React from "react";
import { Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Box } from "./ui/box";
import { useTheme } from "@/utils/Themes/ThemeProvider";

interface LineChartProps {
    lineData: { time: string; price: number }[];
    title: string;
}

const screenWidth = Dimensions.get("window").width;

const LineChartComponent: React.FC<LineChartProps> = ({ lineData, title }) => {
    if (!lineData || lineData.length === 0) {
        return <Text className="text-white text-lg my-4">{title} data not available</Text>;
    }

    const { appliedTheme } = useTheme();
    const prices = lineData.map((item) => item.price);
    const times = lineData.map((item) => item.time);
    const isUp = prices[prices.length - 1] > prices[0];
    const lineColor = isUp ? "rgba(0, 255, 0, 1)" : "rgba(255, 0, 0, 1)";

    return (
        <Box>
            <LineChart
                data={{
                    labels: times,
                    datasets: [{ data: prices, color: () => lineColor, strokeWidth: 3 }],
                }}
                width={screenWidth * 0.56}
                height={screenWidth * 0.18}
                chartConfig={{
                    decimalPlaces: 2,
                    color: () => (isUp ? "rgba(0, 255, 0, 0.6)" : "rgba(255, 0, 0, 1)"),
                    labelColor: () => (isUp ? "rgba(0, 255, 0, 0.6)" : "rgba(255, 0, 0, 1)"),
                    propsForDots: { r: "0" },
                    backgroundColor: appliedTheme === "light" ? "#ffffff" : "#2b2b2b",
                    backgroundGradientFrom: appliedTheme === "light" ? "#ffffff" : "#2b2b2b",
                    backgroundGradientTo: appliedTheme === "light" ? "#ffffff" : "#2b2b2b",
                    strokeWidth: 3,
                    fillShadowGradientOpacity: 0,
                    propsForBackgroundLines: { strokeWidth: 0 },
                }}
                withHorizontalLabels={false}
                withVerticalLabels={false}
                withInnerLines={false}
                withOuterLines={true}
                bezier
                style={{
                    borderRadius: 8,
                    transform: [{ translateX: -60 }],
                }}
            />
        </Box>
    );
};

export default LineChartComponent;
