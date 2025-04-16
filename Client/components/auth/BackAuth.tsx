import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "../ui/box";
import { getIconByString, IC_ChevronLeft, IC_Help } from "@/utils/constants/Icons";
import { TouchableOpacity } from "react-native";
import { SignUpScreensProps } from "@/types/NavigationTypes";
import { useTheme } from "@/utils/Themes/ThemeProvider";
import { Text } from "../ui/text";
import { useTranslation } from "react-i18next";

interface BackAuthProps{
    handleScreenChange: (newScreenStep: 'back' | 'next' | string, data?: any, fromEdit?: boolean) => void;
    headerStep?: number | null;
    theme?: string;
    title?: string;
    icons?: string[];
    onPressIcons?: Function[];
}
function BackAuth({ handleScreenChange, headerStep, theme, title, icons, onPressIcons}: BackAuthProps) {
    const { appliedTheme } = useTheme();
    const { t } = useTranslation();
    
    function handleBackPress() {
        handleScreenChange('back');
    }

    return (
        <SafeAreaView className="z-50">
            <Box className={`flex-row justify-between p-6 items-center relative`}>
                
                <TouchableOpacity
                    className="absolute left-4"
                    onPress={() => handleBackPress()}
                    activeOpacity={0.7}
                >
                    <IC_ChevronLeft className="w-8 h-8" color={[theme,appliedTheme].includes("dark") ? "white" : "black"} />
                </TouchableOpacity>

                <Box className="flex-1 items-center justify-center">
                    <Text className={`font-bold  text-xl text-center ${[theme,appliedTheme].includes("dark") ? "text-text-dark" : "text-text-light"}`}>
                        {title || ""}
                    </Text>
                </Box>
                

                {headerStep && 
                <Box className={`items-center justify-center rounded-full p-3 bg-card-${appliedTheme}`}>
                    <Text className={`font-semibold text-text-${appliedTheme}`}>
                        {t('backAuth.step', { step: headerStep, totalSteps: 3 })}
                    </Text>
                </Box>
                }

                {/* Right Icons */}
                <Box className="flex-row items-center absolute gap-2 right-4">
                    {icons?.map((icon, index) => {
                        const IconComponent = getIconByString(icon || "");
                        return (
                        <TouchableOpacity key={icon}>
                            {IconComponent && <IconComponent className="w-8 h-8" color={[theme,appliedTheme].includes("dark") ? "white" : "black"}/>}
                        </TouchableOpacity>
                        )
                    })}
                </Box>
            </Box>
        </SafeAreaView>
    );
}

export default BackAuth;