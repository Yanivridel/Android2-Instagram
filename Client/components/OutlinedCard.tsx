import React from 'react'
import { Card } from './ui/card';
import { Text } from './ui/text';
import { cn } from './ui/cn';
import { useTheme } from '@/utils/Themes/ThemeProvider';

interface OutlinedCardProps {
    children: any;
    title?: string;
    className?: string;
}

function OutlinedCard({ children, title, className }: OutlinedCardProps) {
    const { appliedTheme } = useTheme();

    return (
        <Card variant='filled' size="lg" className={cn(`shadow-sm bg-lightGray-${appliedTheme}`, className)}>
            {title && <Text className='absolute -top-4 left-0 bg-white rounded-r-lg rounded-tl-lg py-1 px-2 text-[13px] font-semibold'>{title}</Text>}
            {children}
        </Card>
    )
}

export default OutlinedCard;