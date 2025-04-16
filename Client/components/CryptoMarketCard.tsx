import React from "react";
import { Pressable, Text } from "react-native";
import { Box } from "@/components/ui/box";
import LineChartWagmi from "./LineChartWagmi";
import { CryptoData } from "@/utils/api/internal/sql/handleSQLite";
import { getIconByString, IC_BTCUSDT } from "@/utils/constants/Icons";
import { formatNumber, formatSymbol } from "@/utils/functions/help";
import { useTheme } from "@/utils/Themes/ThemeProvider";

interface CryptoMarketCardProps extends CryptoData {
    onPress?: () => any;
}

const CryptoMarketCard: React.FC<CryptoMarketCardProps> = ({ symbol, price, change, lineData, onPress }) => {
    const { appliedTheme } = useTheme();
    const dateString = (new Date()).toISOString().split("T")[0];
    const data = lineData.map(({ price, time }) => {
        const timestamp = new Date(`${dateString}T${time}Z`).getTime();
        return { timestamp, value: Number(price) };
    });

    const Icon = getIconByString('IC_'+symbol) || IC_BTCUSDT;
    
    return (
        <Pressable onPress={onPress}>
            <Box className="p-2 flex flex-row gap-2 items-center">
                <Box className={`max-w-[4rem] p-4 rounded-2xl z-10`}>
                    {Icon && <Icon className="w-8 h-8" />}
                </Box>
                <Box className="flex flex-col justify-center z-10">
                    <Text className={`text-text-${appliedTheme} text-[16px] font-bold`}>{formatSymbol(symbol)}</Text>
                    <Text className="text-[13px] text-[#969AA0]">
                        {change !== null ? `${Number(change) > 0 ? '+' : ''}${Number(change).toFixed(2)}%` : "Loading..."}
                    </Text>
                </Box>
                <Box className="flex-1 flex-row h-full">
                    <LineChartWagmi
                        lineData={data}
                        tooltip={true}
                    />
                </Box>
                <Box className="flex flex-col justify-center items-end">
                    <Text className={`text-text-${appliedTheme} text-[16px] font-semibold`}>
                        {price !== null ? `${formatNumber(Number(price))}` : ""}
                    </Text>
                    <Text className="text-[#969AA0]">{symbol}</Text>
                </Box>
            </Box>
        </Pressable>
    );
};

export default CryptoMarketCard;
