import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Dimensions, 
    TouchableOpacity,
    Pressable, 
} from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring, 
    withTiming,
    withSequence,
    withDelay,
    runOnJS,
    useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import MyLinearGradient from './gradient/MyLinearGradient';

const { width } = Dimensions.get('window');

interface RatingData {
    gradient: [string, string];
    shadow: string;
}

interface RatingPopupProps {
    onRate: (value: number, type: "Post" | "Comment" | "User", targetId: string) => void;
    onClose?: () => void;
    type: "Post" | "Comment" | "User";
    targetId: string;
    position?: { x: number; y: number };
}

const ratingData: Record<number, RatingData> = {
    1: {
    gradient: ['#F3E5F5', '#E1BEE7'],  // Soft lilac
    shadow: '#E1BEE720'
    },
    2: {
    gradient: ['#E1BEE7', '#CE93D8'],  // Light lavender
    shadow: '#CE93D820'
    },
    3: {
    gradient: ['#CE93D8', '#BA68C8'],  // Mid violet
    shadow: '#BA68C820'
    },
    4: {
    gradient: ['#BA68C8', '#AB47BC'],  // Bold purple
    shadow: '#AB47BC20'
    },
    5: {
    gradient: ['#AB47BC', '#8E24AA'],  // Deep violet
    shadow: '#8E24AA20'
    },
};


const STAR_SIZE = 40;
const POPUP_HEIGHT = 55;
const SWIPE_THRESHOLD = 30;

const RatingPopup: React.FC<RatingPopupProps> = ({ 
    onRate, 
    type = 'Post', 
    targetId, 
    onClose,
    position = { x: width / 2, y: 400 }
}) => {
    const [selectedRating, setSelectedRating] = useState<number>(0);
    
    // Animation values
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(10);
    const successScale = useSharedValue(0);
    const confettiOpacity = useSharedValue(0);
    
    // Star animations
    const starScales = Array.from({ length: 5 }, () => useSharedValue(1));
    const starOpacities = Array.from({ length: 5 }, () => useSharedValue(0.6));
    const starRotations = Array.from({ length: 5 }, () => useSharedValue(0));
    
    // Swipe gesture
    const swipeProgress = useSharedValue(0);
    const gestureRef = useRef(null);

    const timeoutRef = useRef<NodeJS.Timeout>(null);
    const submitTimeoutRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        // Entry animation
        scale.value = withSpring(1, { damping: 18, stiffness: 120 });
        opacity.value = withTiming(1, { duration: 300 });
        translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
        
        // Stagger star appearance
        starOpacities.forEach((anim, index) => {
        anim.value = withDelay(index * 80, withSpring(1, { damping: 12, stiffness: 100 }));
        });
    }, []);

    const handleStarPress = (rating: number): void => {
        setSelectedRating(rating);
        animateStarSelection(rating);        
        
        // Auto-submit immediately for quick interactions
        handleSubmit(rating);
    };

    const animateStarSelection = (rating: number): void => {
        starScales.forEach((scale, index) => {
        if (index < rating) {
            scale.value = withSequence(
            withSpring(1.4, { damping: 10, stiffness: 150 }),
            withSpring(1.1, { damping: 8, stiffness: 100 })
            );
            starRotations[index].value = withSequence(
            withTiming(15, { duration: 150 }),
            withTiming(-10, { duration: 100 }),
            withTiming(0, { duration: 100 })
            );
        } else {
            scale.value = withSpring(0.8, { damping: 12, stiffness: 100 });
            starRotations[index].value = withTiming(0, { duration: 200 });
        }
        });
    };

    const handleSubmit = (rating: number): void => {
        if (rating === 0) {
            onRate(0, type, targetId);
            handleClose();
            return;
        }
        

        // Use ref for timeout
        submitTimeoutRef.current = setTimeout(() => {
            successScale.value = withSpring(1, { damping: 15, stiffness: 120 });
            confettiOpacity.value = withTiming(1, { duration: 400 });
            
            onRate(rating, type, targetId );

            // Use ref for timeout
            timeoutRef.current = setTimeout(() => {
                opacity.value = withTiming(0, { duration: 200 });

                handleClose();
            }, 300);
        }, 200);
    };

    useEffect(() => {
        return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
        };
    }, []);

    const handleClose = (): void => {
        scale.value = withSpring(0, { damping: 20, stiffness: 100 });
        opacity.value = withTiming(0, { duration: 200 });
        translateY.value = withSpring(10, { damping: 15, stiffness: 100 });
        
        setTimeout(() => {
        onClose?.();
        }, 300);
    };

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, context) => {
        context.startX = 0;
        },
        onActive: (event, context) => {
        const deltaX = event.translationX - (context.startX as number);
        const progress = Math.max(0, Math.min(4, deltaX / SWIPE_THRESHOLD));
        swipeProgress.value = progress;
        
        const newRating = Math.floor(progress) + 1;
        if (newRating !== selectedRating && newRating >= 1 && newRating <= 5) {
            runOnJS(setSelectedRating)(newRating);
            runOnJS(animateStarSelection)(newRating);
        }
        },
        onEnd: () => {
        const finalRating = Math.max(1, Math.min(5, Math.floor(swipeProgress.value) + 1));
        runOnJS(setSelectedRating)(finalRating);
        runOnJS(animateStarSelection)(finalRating);
        
        // Submit immediately after animation
        runOnJS(handleSubmit)(finalRating);
        },
    });

    const containerStyle = useAnimatedStyle(() => ({
        transform: [
        { scale: scale.value },
        { translateY: translateY.value }
        ],
        opacity: opacity.value,
    }));

    const currentData = selectedRating > 0 ? ratingData[selectedRating] : ratingData[3];

    const starStyles = Array.from({ length: 5 }).map((_, index) => {
        return useAnimatedStyle(() => ({
        transform: [
            { scale: starScales[index].value },
            { rotate: `${starRotations[index].value}deg` }
        ],
        opacity: starOpacities[index].value,
        }));
    });

    return (
        <View className="absolute inset-0 z-50">
        {/* Full-screen backdrop */}
        <Pressable
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
            onPress={() => handleSubmit(0)}
        />
        <Animated.View
            className="absolute z-50"
            style={[
            containerStyle,
            {
                left: position.x - 160,
                top: position.y - POPUP_HEIGHT - 20,
                width: 320,
                height: POPUP_HEIGHT,
            }
            ]}
        >
            <PanGestureHandler ref={gestureRef} onGestureEvent={gestureHandler}>
                <Animated.View 
                className="flex-1 rounded-2xl overflow-hidden"
                style={{
                    shadowColor: currentData.shadow,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                    elevation: 12,
                }}
                >
                
                <MyLinearGradient type='background' customColors={currentData.gradient} 
                    className="flex-1"
                >
                    <View className="flex-1 px-4">
                        {/* Stars Container */}
                        <View className="flex-row justify-between items-center px-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const isActive = star <= selectedRating;
                                const starIndex = star - 1;
                                
                                return (
                                    <TouchableOpacity
                                    key={star}
                                    onPress={() => handleStarPress(star)}
                                    activeOpacity={0.8}
                                    className="items-center justify-center"
                                    style={{ width: STAR_SIZE, height: STAR_SIZE }}
                                    >
                                        <Animated.Text 
                                            style={[
                                            starStyles[starIndex], // Use precomputed style
                                            {
                                                fontSize: 32,
                                                color: isActive ? '#FFD700' : '#FFFFFF60',
                                                textShadowColor: 'rgba(0,0,0,0.3)',
                                                textShadowOffset: { width: 0, height: 2 },
                                                textShadowRadius: 4,
                                            }
                                            ]}
                                        >
                                            ⭐
                                        </Animated.Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </MyLinearGradient>
                </Animated.View>
            </PanGestureHandler>

        </Animated.View>
        </View>
    );
};

export default RatingPopup;