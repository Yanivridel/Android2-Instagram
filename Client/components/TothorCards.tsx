import React from 'react';
import { Box } from './ui/box';
import { useTheme } from '@/utils/Themes/ThemeProvider';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const TothorCards: React.FC<CardProps> = ({ children, className }) => {
    const { appliedTheme } = useTheme();
    return (
        <Box className={`bg-card-${appliedTheme} rounded-3xl h-fit p-2 ${className}`}>
                {children}
        </Box>
    );
};

export default TothorCards;