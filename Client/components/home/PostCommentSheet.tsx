import { 
    Actionsheet, 
    ActionsheetContent, 
    ActionsheetDragIndicator, 
    ActionsheetDragIndicatorWrapper, 
    ActionsheetBackdrop 
} from "@/components/ui/actionsheet";
import React, { useEffect, useRef } from "react";
import { 
    NativeViewGestureHandler, 
    PanGestureHandler, 
    PanGestureHandlerGestureEvent 
} from "react-native-gesture-handler";
import Animated, { 
    useAnimatedStyle, 
    useSharedValue, 
    withTiming, 
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedScrollHandler,
    useAnimatedRef
} from "react-native-reanimated";
import { View, Text, StyleSheet } from "react-native";
import { Box } from "../ui/box";
import PostComment from "./PostComment";
import { IComment } from "@/types/commentTypes";

interface PostCommentSheetProps {
    showActionsheet: boolean;
    setShowActionsheet: (showActionsheet: boolean) => void;
}

  // Dummy comments data
const dummyComments: IComment[] = [
    // { id: '1', text: 'This is a great post! REALLY REALLY GREAT POST! Loved every bit of it! <3', user: 'user1' },
    // { id: '2', text: 'I love this content!', user: 'user2' },
    // { id: '3', text: 'Amazing work!', user: 'user3' },
    // { id: '4', text: 'Keep it up!', user: 'user4' },
    // { id: '5', text: 'This is so inspiring!', user: 'user5' },
    // { id: '6', text: 'I can relate to this!', user: 'user6' },
    // { id: '7', text: 'This is exactly what I needed!', user: 'user7' },
    // { id: '8', text: 'Great job!', user: 'user8' },
    // { id: '9', text: 'This is awesome!', user: 'user9' },
    // { id: '10', text: 'I love your style!', user: 'user10' },
    // // Add more comments to ensure scrolling
    // { id: '11', text: 'Fantastic post!', user: 'user11' },
    // { id: '12', text: 'Love this!', user: 'user12' },
    // { id: '13', text: 'Amazing content!', user: 'user13' },
    // { id: '14', text: 'Keep sharing!', user: 'user14' },
    // { id: '15', text: 'Very inspiring!', user: 'user15' },
];

type ContextType = {
    startY: number;
};

const PostCommentSheet = ({showActionsheet, setShowActionsheet}: PostCommentSheetProps) => {
    const handleClose = () => setShowActionsheet(false);

    // Create shared values for tracking the gesture and scroll state
    const translateY = useSharedValue(0);
    const scrollOffset = useSharedValue(0);
    const isDraggingSheet = useSharedValue(false);

    // Refs for gesture handlers
    const flatListRef = useAnimatedRef<Animated.FlatList<any>>();
    const panRef = useRef(null);
    const nativeViewRef = useRef(null);

    // Reset translateY when the sheet is opened
    useEffect(() => {
        if (showActionsheet) {
        translateY.value = 0;
        }
    }, [showActionsheet]);

    // Gesture handler for dragging the sheet
    const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, ContextType>({
        onStart: (_, ctx) => {
        ctx.startY = translateY.value;
        },
        onActive: (event, ctx) => {
        // Only allow dragging when at the top of scroll or with a significant downward velocity
        if (scrollOffset.value <= 0 && event.translationY > 0) {
            translateY.value = ctx.startY + event.translationY;
            isDraggingSheet.value = true;
        }
        },
        onEnd: (_) => {
        if (isDraggingSheet.value) {
            // If dragged down enough, close the sheet
            if (translateY.value > 100) {
            translateY.value = withTiming(500, { duration: 200 });
            runOnJS(handleClose)();
            } else {
            // Otherwise snap back
            translateY.value = withTiming(0, { duration: 200 });
            }
            isDraggingSheet.value = false;
        }
        },
    });

    // Handle scroll events to determine if we're at the top
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
        scrollOffset.value = event.contentOffset.y;
        },
        onBeginDrag: () => {
        isDraggingSheet.value = false;
        },
    });

    // Animated style for the content
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    // Header component with drag indicator that can be used to drag down
    const HeaderComponent = () => (
        <ActionsheetDragIndicatorWrapper>
        <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
    );

    return (
        <>
        <Actionsheet snapPoints={[90]} isOpen={showActionsheet} onClose={handleClose}>
            <ActionsheetBackdrop />
            <PanGestureHandler
            ref={panRef}
            onGestureEvent={panGesture}
            simultaneousHandlers={nativeViewRef}
            >
            <Animated.View 
                className="flex-1 "
                style={animatedStyle}>
                <ActionsheetContent>
                <HeaderComponent />
                <Text className="font-bold">Comments</Text>
                
                <NativeViewGestureHandler
                    ref={nativeViewRef}
                    simultaneousHandlers={panRef}
                >
                    <Animated.FlatList
                        className="flex-1 w-full"
                        ref={flatListRef}
                        data={dummyComments}
                        renderItem={({ item }) => <PostComment comment={item} />}
                        keyExtractor={(item) => String(Number(item._id))} // Change later
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                        contentContainerStyle={{paddingBottom: 20}}
                        bounces={true}
                        showsVerticalScrollIndicator={false}
                    />
                </NativeViewGestureHandler>
                </ActionsheetContent>
            </Animated.View>
            </PanGestureHandler>
        </Actionsheet>
        </>
    );
};

export default PostCommentSheet;
