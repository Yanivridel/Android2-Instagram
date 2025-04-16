import React from "react";
import { Text } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { AlertCircle, BellRing } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import { useTheme } from "@/utils/Themes/ThemeProvider";

interface NotificationCardProps {
    title: string;
    message: string;
    timeAgo: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
    title,
    message,
    timeAgo,
}) => {
    const { appliedTheme } = useTheme();
    return (
        <Box className={`p-4 bg-card-${appliedTheme} rounded-lg gap-2 flex-row items-start space-x-3`}>
            <Icon as={BellRing} size="lg" color={appliedTheme === 'light' ? 'black' : 'white'} className="mt-1" />
            <Box className="flex-1">
                <Text className={`text-text-${appliedTheme} font-semibold`}>{title}</Text>
                <Text className={`text-sm text-subText-${appliedTheme}`}>{message}</Text>
            </Box>
            <HStack space="sm" className="items-center">
                <Icon as={AlertCircle} size="lg" color={appliedTheme === 'light' ? 'black' : 'white'} />
                <Text className="text-xs text-gray-400">{timeAgo}</Text>
            </HStack>
        </Box>
    );
};

export default NotificationCard;