import React from 'react';
import { TouchableOpacity, Dimensions } from 'react-native';
import { Box } from './ui/box';
import { Text } from './ui/text';
import { useTheme } from '@/utils/Themes/ThemeProvider';

interface ButtonsTrainProps {
    buttons: string[],
    activeButton: string,
    handlePress: (newCategory: string) => void;
}

const ButtonsTrain = ({ buttons, activeButton, handlePress }: ButtonsTrainProps) => {
    const screenWidth = Dimensions.get('window').width - 20; // px-5
    const buttonWidth = screenWidth / buttons.length;
    const { appliedTheme } = useTheme();
    
    return (
        <Box className={`flex flex-row items-center justify-center relative h-12 bg-card-${appliedTheme} rounded-lg overflow-hidden`}>
            {buttons.map((category, idx) => {
                const isActive = activeButton === category;
                return (
                    <TouchableOpacity
                        key={category+idx}
                        style={{ width: buttonWidth }}
                        className={`h-full flex justify-center 
                            ${isActive ? 'bg-indigo-600 z-10 rounded-lg' : `bg-card-${appliedTheme}`}`}
                        onPress={() => handlePress(category)}
                        activeOpacity={0.8}
                    >
                        <Text className={`font-medium text-center ${isActive ? 'text-white' : appliedTheme === 'light' ? 'text-black' : 'text-white'}`}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </Box>
    );
};

export default ButtonsTrain;