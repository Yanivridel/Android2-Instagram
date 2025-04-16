import React from "react";
import { Text, ActivityIndicator, View, Dimensions } from "react-native";
import Svg, { Line, Rect } from "react-native-svg";
import { scaleLinear } from "d3-scale";
import { Box } from "./ui/box";

interface CandlestickChartProps {
    candlestickData: any[];
    title: string;
}

const screenWidth = Dimensions.get("window").width;

const CandlestickChart: React.FC<CandlestickChartProps> = ({ candlestickData, title }) => {
    const chartWidth = screenWidth * 0.8;
    const chartHeight = 120;
    const candleWidth = 8;

    if (!candlestickData || candlestickData.length === 0) {
        return (
            <View className="my-6">
                <Text className="text-black text-lg">{title} data not available</Text>
                <ActivityIndicator size="large" color="#FFD700" className="my-4" />
            </View>
        );
    }

    const minPrice = Math.min(...candlestickData.map((d) => d.low));
    const maxPrice = Math.max(...candlestickData.map((d) => d.high));

    const xScale = scaleLinear().domain([0, candlestickData.length]).range([0, chartWidth]);
    const yScale = scaleLinear().domain([minPrice, maxPrice]).range([chartHeight, 0]);

    return (
        <Box className="flex flex-row between items-center gap-8">
            <Box className="mt-6">
                <Text className="text-sm font-bold text-black">{title}</Text>
            </Box>
            <Svg width={chartWidth} height={chartHeight} style={{ marginTop: 20 }}>
                {candlestickData.map((d, index) => {
                    const x = xScale(index);
                    const openY = yScale(d.open);
                    const closeY = yScale(d.close);
                    const highY = yScale(d.high);
                    const lowY = yScale(d.low);

                    return (
                        <React.Fragment key={index}>
                            {/* Wick Line (High to Low) */}
                            <Line
                                x1={x}
                                y1={highY}
                                x2={x}
                                y2={lowY}
                                stroke="darkgray"
                                strokeWidth={2}
                            />
                            {/* Candle Body */}
                            <Rect
                                x={x - candleWidth / 2}
                                y={Math.min(openY, closeY)}
                                width={candleWidth}
                                height={Math.abs(openY - closeY)}
                                fill={d.open > d.close ? "red" : "green"}
                            />
                        </React.Fragment>
                    );
                })}
            </Svg>
        </Box>
    );
};

export default CandlestickChart;
