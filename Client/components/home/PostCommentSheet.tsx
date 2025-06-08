import { 
    Actionsheet, 
    ActionsheetContent, 
    ActionsheetDragIndicator, 
    ActionsheetDragIndicatorWrapper, 
    ActionsheetBackdrop 
} from "@/components/ui/actionsheet";
import React, { useEffect, useRef, useState } from "react";
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
import { getCommentsByPostId } from "@/utils/api/internal/commentApi";
import SpinnerLoader from "../SpinnerLoader";

interface PostCommentSheetProps {
    showActionsheet: boolean;
    setShowActionsheet: (showActionsheet: boolean) => void;
    postId: string
}


type ContextType = {
    startY: number;
};

const PostCommentSheet = ({showActionsheet, setShowActionsheet, postId}: PostCommentSheetProps) => {
    const handleClose = () => setShowActionsheet(false);
    const [ comments, setComments ] = useState<IComment[] | null>(null);
    const [ isLoadingComments, setIsLoadingComments ] = useState(true);

    // Create shared values for tracking the gesture and scroll state
    const translateY = useSharedValue(0);
    const scrollOffset = useSharedValue(0);
    const isDraggingSheet = useSharedValue(false);

    // Refs for gesture handlers
    const flatListRef = useAnimatedRef<Animated.FlatList<any>>();
    const panRef = useRef(null);
    const nativeViewRef = useRef(null);

    useEffect(() => {
        getCommentsByPostId({ postId })
        .then(comments => { 
            setComments(comments);
            setIsLoadingComments(false);
        })
    }, [ postId ]);

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
                        data={comments}
                        renderItem={({ item }) => <PostComment comment={item} />}
                        keyExtractor={(item) => String(item._id)} // Change later
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                        contentContainerStyle={{paddingBottom: 20}}
                        bounces={true}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            isLoadingComments ? 
                                <SpinnerLoader className='mt-10'/> : 
                                <Text className='p-4 color-indigo-600 mx-auto mt-5'>Be the first to comment</Text>
                        }
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
