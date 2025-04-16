import React from 'react'
import { Box } from './ui/box'
import { useTheme } from '@/utils/Themes/ThemeProvider'

interface OptionCardProps {
    children: React.ReactNode;
}

const OptionCard: React.FC<OptionCardProps> = ({ children }) => {
    const { appliedTheme } = useTheme()
    return (
        <Box className={`bg-card-${appliedTheme} p-6 rounded-2xl h-[166px] w-[158px] flex justify-center`}>
            {children}
        </Box>
    )
}

export default OptionCard