import React from 'react';
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from '@/components/ui/actionsheet';
import { Pressable, Image, FlatList } from 'react-native';
import { Text } from '../ui/text';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { Box } from '../ui/box';

type ShareOption = {
  icon: any; // React component or image source
  label: string;
};

type ShareSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption?: (option: ShareOption) => void;
};

const shareOptions: ShareOption[] = [
    { icon: require('@/assets/images/share.png'), label: 'Share' },
    { icon: require('@/assets/images/copy_link.png'), label: 'Copy Link' },
    { icon: require('@/assets/images/whatsapp_image.png'), label: 'WhatsApp' },
    { icon: require('@/assets/images/Telegram_logo.webp'), label: 'Telegram' },
    { icon: require('@/assets/images/3_dots.png'), label: 'More' },
];

export default function ShareSheet({ isOpen, onClose, onSelectOption }: ShareSheetProps) {
    return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={[27]}>
    <ActionsheetBackdrop />
    <ActionsheetContent className="bg-white rounded-t-3xl px-4 pt-2 pb-6">
        <ActionsheetDragIndicatorWrapper>
        <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <Text className="text-xl font-bold text-violet-700 text-center mb-6">Share</Text>

        <FlatList
            data={shareOptions}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => `${item.label}-${index}`}
            renderItem={({ item }) =>
                <Pressable
                className="items-center mx-3"
                onPress={() => {
                    onSelectOption && onSelectOption(item);
                    onClose();
                }}
                >
                    <Image
                        source={item.icon}
                        style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: '#ede9fe', // light violet
                        marginBottom: 6,
                        }}
                    />
                    <Text className="text-sm text-violet-800 font-medium">{item.label}</Text>
                </Pressable>
            }
        />
    </ActionsheetContent>
    </Actionsheet>
    );
}
