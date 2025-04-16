import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Toast } from "@/components/ui/toast";
import { Pressable } from "react-native";
import { useToast } from "@/components/ui/toast";
import { IC_Mail } from "./Icons";
import { useTheme } from "../Themes/ThemeProvider";
import { InterfaceToastProps } from "@gluestack-ui/toast/lib/types";

type ToastMessageProps = {
    id: string;
    toast: ReturnType<typeof useToast>;
    title: string;
    desc: string;
};

type Toast ={
    show: (props: InterfaceToastProps) => string;
    close: (id: string) => void;
    closeAll: () => void;
    isActive: (id: string) => boolean;
}


const ToastMessage: React.FC<ToastMessageProps> = ({ id, toast, title, desc }) => {
    const insets = useSafeAreaInsets();
    const { appliedTheme } = useTheme()

    return (
    <Toast
        nativeID={id}
        className={`relative p-6 gap-3 w-full bg-card-${appliedTheme} shadow-hard-4 flex-row mt-16`}
        style={{ top: insets.top + 10 }}
    >
        <Pressable className="absolute top-4 right-3" onPress={() => toast.close(id)}>
            <Icon as={CloseIcon} className="stroke-background-500" color={appliedTheme === "dark" ? "white" : "black"}/>
        </Pressable>
        <IC_Mail className="w-16 h-16 mr-2"/>
        <Box className='gap-1'>
            <Text size="lg" className={`text-text-${appliedTheme} font-semibold`}>
                {title}
            </Text>
            <Text size="sm" className={`text-subText-${appliedTheme} max-w-[100px]`}>
                {desc}
            </Text>
        </Box>
    </Toast>
    );
};

// Function to show the toast
export const showNewToast = (toast: ReturnType<typeof useToast>, toastId: string, title: string, desc: string) => {
    toast.show({
        id: toastId,
        placement: "top",
        render: ({ id }) => <ToastMessage id={id} toast={toast} title={title} desc={desc}/>,
    });
};

export const handleToast = (toast: Toast, id: string, title: string, msg: string) => {
    const toastId = "unique-toast-email-verification";
    if (!toast.isActive(toastId)) {
        showNewToast(
            toast,
            toastId,
            title,
            msg
        );
    }
};