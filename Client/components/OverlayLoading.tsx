import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { Portal } from 'react-native-paper';
import { Box } from './ui/box';
import { useTheme } from '@/utils/Themes/ThemeProvider';
import { IC_Tothor_Logo_Only, IC_Tothor_Logo_Only_Bold } from '@/utils/constants/Icons';
import { Svg, Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const OverlayLoading = () => {
    const { appliedTheme } = useTheme();
    const spinValue = useRef(new Animated.Value(0)).current;
    const progressValue = useRef(new Animated.Value(0)).current;
    const [progress, setProgress] = useState(0);
    const strokeWidth = 5;
    const radius = 43;
    const circumference = 2 * Math.PI * radius;

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

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.floor(Math.random() * (10 - 3 + 1)) + 3;
            });
        }, 100);
        
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        Animated.timing(progressValue, {
            toValue: progress,
            duration: 100,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const strokeDashoffset = progressValue.interpolate({
        inputRange: [0, 100],
        outputRange: [circumference, 0],
    });

    return (
        <Portal>
            <Box className={`absolute inset-0 z-[1000] bg-background-dark justify-center items-center`}>
                <Box className={`w-24 h-24 bg-card-${appliedTheme} rounded-full justify-center items-center relative overflow-hidden`}>   
                    <Svg width={90} height={90} viewBox='0 0 96 96' className='absolute z-50'>
                        <Circle
                            cx='48'
                            cy='48'
                            r={radius}
                            stroke='rgba(85, 6, 253, 0.2)'
                            strokeWidth={strokeWidth}
                            fill='none'
                        />
                        <AnimatedCircle
                            cx='48'
                            cy='48'
                            r={radius}
                            stroke='#5506FD'
                            strokeWidth={strokeWidth}
                            fill='none'
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap='round'
                        />
                    </Svg>
                    <Animated.View className="w-[70%] h-[70%] absolute z-20" style={{ transform: [{ rotate: spin }] }}>
                        <IC_Tothor_Logo_Only className='w-full h-full' color={appliedTheme==="dark" ? "white":"black"}/>
                    </Animated.View>
                </Box>
            </Box>
        </Portal>
    );
};

export default OverlayLoading;


// border-purple-500
//  duration: 1700,
/*
const animations = [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)];

    const animateDots = () => {
        const animationsSequence = animations.map((dotAnimation, index) =>
            Animated.timing(dotAnimation, {
                toValue: 1,
                duration: 250,
                delay: index * 200,
                easing: Easing.bezier(0.175, 0.385, 0.82, 1.275),
                useNativeDriver: true,
            })
        );

        Animated.sequence([
            Animated.parallel(animations.map(dotAnimation =>
                Animated.timing(dotAnimation, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                })
            )),
            
            ...animationsSequence,
            
            Animated.delay(150),
        ]).start(() => {
            animateDots();
        });
    };

    useEffect(() => {
        animateDots();
        
        return () => {
            animations.forEach(dotAnimation => dotAnimation.stopAnimation());
        };
    }, []);
    
    const translateY = animations.map(dotAnimation =>
        dotAnimation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, -10, 0],
        })
    );





    <Animated.View style={{ transform: [{ translateY: translateY[0] }] }}>
        <Box className='h-4 w-4 bg-purple-50 rounded-full'/>
    </Animated.View>
    
    <Animated.View style={{ transform: [{ translateY: translateY[1] }] }}>
        <Box className='h-4 w-4 bg-purple-300 rounded-full'/>
    </Animated.View>
    
    <Animated.View style={{ transform: [{ translateY: translateY[2] }] }}>
        <Box className='h-4 w-4 bg-purple-600 rounded-full'/>
    </Animated.View>
*/
