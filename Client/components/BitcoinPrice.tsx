import React from "react";
import { Text, ActivityIndicator } from "react-native";
import { Box } from "@/components/ui/box";

interface BitcoinPriceProps {
    bitcoinPrice: string | null;
    loading: boolean;
}

const BitcoinPrice: React.FC<BitcoinPriceProps> = ({ bitcoinPrice, loading }) => {
    return (
        <Box className="flex justify-center items-center my-4">
            <Text className="text-2xl font-bold text-white">Bitcoin Live Price</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#FFD700" className="my-4" />
            ) : (
                bitcoinPrice && Number(bitcoinPrice) !== 0 && (
                    <Text className="text-3xl font-semibold text-green-400 my-2">
                        {"$" + Number(bitcoinPrice).toLocaleString()}
                    </Text>
                )
            )}
        </Box>
    );
};

export default BitcoinPrice;
