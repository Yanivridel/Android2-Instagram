import { 
    Actionsheet, 
    ActionsheetContent, 
    ActionsheetDragIndicator, 
    ActionsheetDragIndicatorWrapper, 
    ActionsheetBackdrop 
} from "@/components/ui/actionsheet";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { Box } from "../ui/box";
import PostComment from "./PostComment";
import { IComment } from "@/types/commentTypes";
import { createComment, getCommentsByPostId } from "@/utils/api/internal/commentApi";
import SpinnerLoader from "../SpinnerLoader";
import MyLinearGradient from "../gradient/MyLinearGradient";
import { ButtonText, Button } from "../ui/button";
import { Divider } from "../ui/divider";
import { useKeyboard } from '@react-native-community/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PostCommentSheetProps {
    showActionsheet: boolean;
    setShowActionsheet: (showActionsheet: boolean) => void;
    postId: string;
    handleAvatarPress: (userId: string) => void;
}

type ContextType = {
    startY: number;
};

const PostCommentSheet = ({showActionsheet, setShowActionsheet, postId, handleAvatarPress}: PostCommentSheetProps) => {
    const handleClose = () => setShowActionsheet(false);
    const [ comments, setComments ] = useState<IComment[] | null>(null);
    const [ isLoadingComments, setIsLoadingComments ] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(inputValue);
    const setInput = (text: string) => {
        inputRef.current = text;
        setInputValue(text);
    };

    // Create shared values for tracking the gesture and scroll state
    const translateY = useSharedValue(0);
    const scrollOffset = useSharedValue(0);
    const isDraggingSheet = useSharedValue(false);

    // Refs for gesture handlers
    const flatListRef = useAnimatedRef<Animated.FlatList<any>>();
    const panRef = useRef(null);
    const nativeViewRef = useRef(null);

    // Keyboard
    const keyboard = useKeyboard();
    const insets = useSafeAreaInsets();

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

    const sendComment = useCallback(async () => {
        const text = inputRef.current.trim();
        if (!text) return;
    
        const commentPayload = {
        content: text,
        postId,
        parentCommentId: null
        };
        const newComment = await createComment(commentPayload);
        if (newComment) {
            setComments(prev => prev ? [newComment, ...prev] : [newComment]);
        }
        setInput('');
    }, [postId]);

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
                            renderItem={({ item }) => <PostComment comment={item} handleAvatarPress={handleAvatarPress} />}
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
                    
                    <Divider />
                    <Box 
                        className="flex-row w-full items-center px-4 py-2 gap-2"
                        style={{
                        marginBottom: keyboard.keyboardShown 
                            ? (Platform.OS === 'ios' ? insets.bottom : 350)
                            : 20
                        }}
                    >
                        <TextInput
                            className="flex-1 bg-white rounded-full px-4 py-2"
                            placeholder="Message..."
                            placeholderTextColor="#aaa"
                            value={inputValue}
                            onChangeText={setInput}
                            autoCorrect={false}
                        />
                        <MyLinearGradient type='button' color='purple' className='w-[100px]'>
                            <Button onPress={sendComment} className="h-fit rounded-full">
                                <ButtonText className="text-white">Send</ButtonText>
                            </Button>
                        </MyLinearGradient>
                    </Box>
                </ActionsheetContent>

            </Animated.View>

            </PanGestureHandler>
            
        </Actionsheet>
        </>
    );
};

export default PostCommentSheet;
