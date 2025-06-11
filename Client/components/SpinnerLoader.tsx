import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { Box } from "./ui/box";
import { IM_LogoCircle } from "@/utils/constants/Images";
import { cn } from './ui/cn';

interface SpinnerLoaderProps {
    className?: string;
}

export default function SpinnerLoader({ className }: SpinnerLoaderProps) {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const spinAnimation = () => {
            spinValue.setValue(0);
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1800,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => spinAnimation());
        };
        
        spinAnimation();
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Box className={cn('flex-1 justify-center',className)}>
            <Animated.View 
                style={{ 
                    transform: [{ rotate: spin }],
                    alignSelf: 'center'
                }}
            >
                <IM_LogoCircle className="w-[90px] h-[90px]" />
            </Animated.View>
        </Box>
    );
}