import React, { useState } from 'react'
import { LineChart } from 'react-native-wagmi-charts';
import { Box } from './ui/box';
import { LayoutChangeEvent } from 'react-native';
import { cn } from './ui/cn';
import { useTheme } from '@/utils/Themes/ThemeProvider';

const dummyData = [
    { timestamp: 1, value: 10 },
    { timestamp: 2, value: 15 },
    { timestamp: 3, value: 7 },
    { timestamp: 4, value: 20 },
    { timestamp: 5, value: 13 },
    { timestamp: 6, value: 18 }
];

interface LineChartWagmiProps {
    lineData?: {
        timestamp: number, 
        value: number;
    }[];
    tooltip?: boolean;
    className?: string;
    color?: string;
}

const LineChartWagmi = ({className, color, lineData=dummyData, tooltip=true}: LineChartWagmiProps) => {
    // Set up state to track the container's dimensions
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
    const { appliedTheme } = useTheme();
    // Reference to measure the container
    const measureContainer = (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        setContainerDimensions({ width, height });
    };

    const isUp = lineData[lineData.length - 1].value > lineData[0].value;
    const lineColor = color || (isUp ? "#00FF00" : "#FF0000");

    return (
        <Box
            className={cn('w-full h-full',className)}
            onLayout={measureContainer}
        >
            <LineChart.Provider data={lineData}>
                {containerDimensions.width > 0 && containerDimensions.height > 0 && (
                    <LineChart
                        width={containerDimensions.width} 
                        height={containerDimensions.height}
                    >
                        <LineChart.Path color={lineColor}>
                            <LineChart.Gradient />
                        </LineChart.Path>
                        <LineChart.CursorCrosshair 
                        color={appliedTheme === 'light' ? 'black' : 'white' }
                        >
                            {tooltip && (
                            <LineChart.Tooltip
                                textStyle={{ color: appliedTheme === 'light' ? 'black' : 'white' }}
                                style={{
                                    padding: 0,
                                    backgroundColor: 'transparent',
                                    // borderRadius: 5,
                                    // padding: 5,
                                }}
                            />
                        )}

                        </LineChart.CursorCrosshair>

                        
                    </LineChart>
                )}
            </LineChart.Provider>
        </Box>
    )
}

export default LineChartWagmi;