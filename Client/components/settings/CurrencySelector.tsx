import React from "react";
import { Text } from "react-native";
import { CircleDollarSign } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import {
    Radio,
    RadioGroup,
    RadioIndicator,
    RadioLabel,
    RadioIcon,
} from "@/components/ui/radio";
import { CircleIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { CurrencySelectorProps } from "./interfaces";

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
    currency,
    setCurrency,
}) => {
    return (
        <>
            <Box className="flex flex-row gap-2 items-center">
                <Icon as={CircleDollarSign} color="blue" />
                <Text className="text-lg font-bold">Display Currency:</Text>
            </Box>
            <RadioGroup value={currency} onChange={setCurrency}>
                <HStack space="sm">
                    <Radio value="Usd">
                        <RadioIndicator>
                            <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>USD</RadioLabel>
                    </Radio>
                    <Radio value="Eur">
                        <RadioIndicator>
                            <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>EUR</RadioLabel>
                    </Radio>
                </HStack>
            </RadioGroup>
        </>
    );
};

export default CurrencySelector;
