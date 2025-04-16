import React, { useEffect, useRef, useState } from "react";
import { Box } from "@/components/ui/box";
import { useTheme } from "@/utils/Themes/ThemeProvider";
import { Text } from "@/components/ui/text";

const TestScreen = () => {
    const { appliedTheme } = useTheme();
    

    return (
        <Box className="flex-1 p-4 bg-gray-900">
            <Text className="text-lg font-bold text-white text-center mb-4">Live Trading Blotter</Text>
        </Box>
    );
};

export default TestScreen;

/*
const [activeTab, setActiveTab] = useState("Limit");
    const [amount, setAmount] = useState("126.00");
    const [convertedAmount, setConvertedAmount] = useState("56.01");
    const [fromCurrency, setFromCurrency] = useState("Bitcoin");
    const [toCurrency, setToCurrency] = useState("Litecoin");
    const [fromSymbol, setFromSymbol] = useState("₿");
    const [toSymbol, setToSymbol] = useState("Ł");

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setFromSymbol(toSymbol);
        setToSymbol(fromSymbol);
        setAmount(convertedAmount);
        setConvertedAmount(amount);
    };

<Box className="flex-1">
                <Box className="flex-row w-full rounded-lg p-1">
                    <ButtonsTrain
                        buttons={['Market', 'Limit', 'Stop-Limit']}
                        activeButton={activeTab}
                        handlePress={setActiveTab}
                    />
                </Box>

                <Box className="mt-4 bg-gray-100 rounded-lg p-4 flex-row justify-between items-center w-full">
                    <TextInput
                        className="text-xl font-bold flex-1"
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                    />
                    <TouchableOpacity className="flex-row items-center">
                        <Box className="bg-red-100 p-2 rounded-full mr-2">
                            <Text className="text-red-500 font-bold">{fromSymbol}</Text>
                        </Box>
                        <Text className="text-lg font-bold">{fromCurrency}</Text>
                        <ChevronDown className="ml-1 text-gray-500" size={20} />
                    </TouchableOpacity>
                </Box>

                <TouchableOpacity
                    onPress={swapCurrencies}
                    className={`bg-button-${appliedTheme} p-3 rounded-full mt-4 self-center`}
                >
                    <IC_Swap className="text-white w-7 h-7" />
                </TouchableOpacity>

                <Box className="mt-4 bg-gray-100 rounded-lg p-4 flex-row justify-between items-center w-full">
                    <Text className="text-xl font-bold flex-1">{convertedAmount}</Text>
                    <TouchableOpacity className="flex-row items-center">
                        <Box className="bg-green-100 p-2 rounded-full mr-2">
                            <Text className="text-green-500 font-bold">{toSymbol}</Text>
                        </Box>
                        <Text className="text-lg font-bold">{toCurrency}</Text>
                        <ChevronDown className="ml-1 text-gray-500" size={20} />
                    </TouchableOpacity>
                </Box>

                <Box className="p-4 w-full">
                    <Button className={`bg-button-${appliedTheme} w-full rounded-lg mt-6`}>
                        <Text className="text-white text-lg font-bold">Exchange</Text>
                    </Button>
                </Box>
            </Box>

*/

