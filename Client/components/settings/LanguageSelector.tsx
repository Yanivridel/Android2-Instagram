import React from "react";
import { Text } from "react-native";
import { ChevronDownIcon, Languages } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import {
    Select,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicatorWrapper,
    SelectDragIndicator,
    SelectItem,
} from "@/components/ui/select";
import { Icon } from "@/components/ui/icon";

const LanguageSelector: React.FC = () => {
    return (
        <Box className="flex flex-row gap-2 items-center">
            <Icon as={Languages} size="xl" color="blue" className="flex flex-row" />
            <Text className="text-lg font-bold">Language:</Text>
            <Select className="w-[125px]">
                <SelectTrigger className="h-fit" variant="outline" size="md">
                    <SelectInput placeholder="English" />
                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                        <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        <SelectItem label="English" value="eng" />
                        <SelectItem label="French" value="french" />
                        <SelectItem label="Hebrew" value="hebrew" />
                    </SelectContent>
                </SelectPortal>
            </Select>
        </Box>
    );
};

export default LanguageSelector;
