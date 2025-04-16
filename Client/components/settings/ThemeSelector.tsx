import React from "react";
import { Text } from "react-native";
import { SunMoon } from "lucide-react-native";
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

interface ThemeSelectorProps {
    theme: "light" | "dark" | "system";
    setTheme: (theme: "light" | "dark" | "system") => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ theme, setTheme }) => {
    return (
        <>
            <Box className="flex flex-row gap-2 items-center">
                <Icon as={SunMoon} color="blue" />
                <Text className="text-lg font-bold">Theme:</Text>
            </Box>
            <RadioGroup value={theme} onChange={setTheme}>
                <HStack space="sm">
                    <Radio value="light">
                        <RadioIndicator>
                            <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>Light</RadioLabel>
                    </Radio>
                    <Radio value="dark">
                        <RadioIndicator>
                            <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>Dark</RadioLabel>
                    </Radio>
                    <Radio value="system">
                        <RadioIndicator>
                            <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>System Default</RadioLabel>
                    </Radio>
                </HStack>
            </RadioGroup>
        </>
    );
};

export default ThemeSelector;
