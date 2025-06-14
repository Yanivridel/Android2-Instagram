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
