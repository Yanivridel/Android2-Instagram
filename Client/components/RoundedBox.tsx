import { View, Text } from 'react-native'
import React from 'react'
import { Box } from './ui/box'
import { useTheme } from '@/utils/Themes/ThemeProvider'

interface RoundedBoxProps {
    children: React.ReactNode;
}

const RoundedBox: React.FC<RoundedBoxProps> = ({ children }) => {
    const { appliedTheme } = useTheme()
    return (
        <Box className={`bg-card-${appliedTheme} p-4 rounded-2xl h-[280px] w-full flex items-center justify-center`}>
            {children}
        </Box>
    )
}

export default RoundedBox