import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { IC_Arrow_Left, IC_Arrow_Left_White } from "@/utils/constants/Icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/utils/Themes/ThemeProvider";
import { Box } from "./ui/box";
import { Text } from "./ui/text";

interface BackHeaderProps {
    title?: string;
    icons?: string[];
    onPressIcons?: Function[];
    bgColor?: "transparent" | "white" | "black";
    colorScheme?: "alwaysWhite" | "themeBased";
}

function BackHeader({ title, icons, onPressIcons, bgColor = "transparent", colorScheme = "themeBased" }: BackHeaderProps) {
    const navigation = useNavigation();
    const { appliedTheme } = useTheme();

    // Determine the background class based on the bgColor prop
    const getBgClass = () => {
        switch(bgColor) {
            case "white": return "bg-white";
            case "black": return "bg-black";
            default: return "bg-transparent";
        }
    };

    // Determine the arrow icon and text color based on the colorScheme prop
    const isWhite = colorScheme === "alwaysWhite";
    const ArrowIcon = isWhite ? IC_Arrow_Left_White : IC_Arrow_Left;
    const textColor = isWhite ? "text-white" : `text-text-${appliedTheme}`;

    return (
        <SafeAreaView>
            <Box className={`p-4 mb-[1rem] ${getBgClass()} flex-row items-center justify-between relative`}>
                
                {/* Left Chevron Button */}
                <TouchableOpacity
                    className="absolute left-4"
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <ArrowIcon className="w-8 h-8" />
                </TouchableOpacity>

                {/* Centered Title */}
                <Box className="flex-1 items-center justify-center">
                    <Text className={`font-bold ${textColor} text-xl text-center`}>{title || ""}</Text>
                </Box>
                {/* Right Icons */}
                <Box className="flex-row items-center absolute gap-2 right-4">
                    {icons?.map((icon, index) => (
                        <TouchableOpacity key={icon} onPress={() => onPressIcons?.[index]?.()}>
                            <Text>{icon}</Text>
                        </TouchableOpacity>
                    ))}
                </Box>
            </Box>
        </SafeAreaView>
    );
}

export default BackHeader;
