import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { FlatList, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Keyboard, TouchableWithoutFeedback, SectionList } from 'react-native';
import io from 'socket.io-client';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Props } from '@/types/NavigationTypes';
import { ChevronLeft } from 'lucide-react-native';
import { IUser } from '@/types/userTypes';
import { IMessage } from '@/types/messageTypes';
import MyLinearGradient from '@/components/gradient/MyLinearGradient';
import { createMessage, getMessageByChatId } from '@/utils/api/internal/messageApi';
import SpinnerLoader from '@/components/SpinnerLoader';
import { Avatar, AvatarImage, AvatarFallbackText } from '@/components/ui/avatar';
import UserAvatar from '@/components/UserAvatar';
import { format } from 'date-fns';
import { useKeyboard } from '@react-native-community/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BASE_API_URL } from '@env';

const socket = io(BASE_API_URL); 

interface messageRouteType {
    params: {
        chatId: string;
        user: Partial<IUser>; // _id, profileImage, username
    };
}

const MessageScreen = ({ route, navigation }: Props) => {
    const { chatId, user: otherUser } = (route as messageRouteType).params;
    const currentUser = useSelector((state: RootState) => state.currentUser);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const flatListRef = useRef<SectionList>(null);
    const shouldAutoScroll = useRef(true);
    const groupedMessages = useMemo(() => groupMessagesByDate(messages), [messages]);

    // Keyboard
    const keyboard = useKeyboard();
    const insets = useSafeAreaInsets();

    function normalizedMessage(msg: IMessage) {
        const isSentByCurrentUser = msg.senderId === currentUser._id;
        return {
            ...msg,
            senderId: isSentByCurrentUser
            ? currentUser
            : {
                _id: otherUser._id,
                username: otherUser.username,
                profileImage: otherUser.profileImage,
                },
            recipientId: isSentByCurrentUser
            ? {
                _id: otherUser._id,
                username: otherUser.username,
                profileImage: otherUser.profileImage,
                }
            : currentUser,
        };
    }

    // Debounced scroll to end function
    const scrollToEnd = useCallback(() => {
        setTimeout(() => {
        if (!flatListRef.current) return;
    
        const lastSectionIndex = groupedMessages.length - 1;
        const lastItemIndex = groupedMessages[lastSectionIndex]?.data.length - 1;
    
        if (lastSectionIndex >= 0 && lastItemIndex >= 0) {
            flatListRef.current.scrollToLocation({
            sectionIndex: lastSectionIndex,
            itemIndex: lastItemIndex,
            animated: true,
            });
        }
        }, 100);
    }, [groupedMessages]);

    // Load Messages
    useEffect(() => {
        const loadMessages = async () => {
        try {
            setIsLoading(true);
            const initialMessages = await getMessageByChatId({ chatId });            
    
            const normalized = (initialMessages || []).map(normalizedMessage) as any; 
            // const normalized = normalizedMessages(initialMessages || []);
    
            setMessages(normalized || []);
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setIsLoading(false);
        }
        };
    
        loadMessages();
    }, [chatId]);

    // Socket Connection:
    useEffect(() =>{
        const handleIncomingMessage = (message: IMessage) => {
            if (message.senderId === currentUser._id) return;
            setMessages(prev => [...prev, message]);
        };
        
        socket.emit("join-chat", chatId);
        socket.on('receive-message', handleIncomingMessage);
    
        return () => {
            socket.off('receive-message', handleIncomingMessage);
        };
    }, [chatId]);


    const sendMessage = () => {
        if (!input.trim()) return;

        const message = {
            content: input,
            senderId: currentUser._id,
            recipientId: otherUser._id || "",
            chatId,
            createdAt: new Date().toISOString(),
        };

        socket.emit('send-message', { chatId, message });        
        
        // Add message optimistically
        const normalizedMsg = normalizedMessage(message) as any;
        setMessages(prev => [...prev, normalizedMsg]);
        // createMessage({content: message.content, recipientId: message.recipientId })
        setInput('');
        
        // Scroll after sending
        scrollToEnd();
    };

    // Track if user is scrolled to bottom
    const handleScroll = (event: any) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 50;
        shouldAutoScroll.current = isAtBottom;
    };

    function groupMessagesByDate(messages: IMessage[]) {
        const grouped: { title: string; data: IMessage[] }[] = [];
    
        messages.forEach(msg => {
        const dateStr = format(new Date(String(msg.createdAt)), 'yyyy-MM-dd');
    
        const existingGroup = grouped.find(g => g.title === dateStr);
        if (existingGroup) {
            existingGroup.data.push(msg);
        } else {
            grouped.push({
            title: dateStr,
            data: [msg],
            });
        }
        });
    
        return grouped;
    };

    return (
        <Box className="flex-1 bg-indigo-100">
            {/* Top Bar */}
            <MyLinearGradient type='background' color='turquoise'>
                <Box className="flex-row items-center px-4 py-3 border-b">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
                        <ChevronLeft color="white" size={24} />
                    </TouchableOpacity>
                    <Box className='flex-row gap-2 items-center'>
                        <UserAvatar
                            rating={otherUser.ratingStats?.averageScore || 3}
                            username={otherUser.username || ""}
                            profileImage={otherUser.profileImage}
                            sizePercent={12}
                        />
                        <Text className="text-white text-base font-semibold flex-1">
                            {otherUser.username}
                        </Text>
                    </Box>
                </Box>
            </MyLinearGradient>
    
            {/* Messages */}
            <Box className="flex-1">
                <SectionList
                    style={{ flex: 1 }}
                    ref={flatListRef}
                    sections={groupedMessages}
                    keyExtractor={(item, index) => item._id ?? `${item.createdAt}_${index}`}
                    renderItem={({ item, index, section }) => {
                        const isSentByCurrentUser = item.senderId._id === currentUser._id;
                        const showAvatar = index === 0 || section.data[index - 1]?.senderId._id !== item.senderId._id;

                        return (
                        <Box className={`flex-row mb-2 ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            {!isSentByCurrentUser && showAvatar && (
                            <UserAvatar
                                rating={otherUser.ratingStats?.averageScore || 3}
                                username={otherUser.username || ""}
                                profileImage={otherUser.profileImage}
                                sizePercent={8}
                                hasBorder={false}
                                className='mr-2'
                            />
                            )}
                            {!isSentByCurrentUser && !showAvatar && <Box className="w-8 mr-2" />}

                            <MyLinearGradient
                            type='background'
                            color={isSentByCurrentUser ? 'turquoise-button' : "gray"}
                            className={`w-fit rounded-2xl px-4 py-2 max-w-[75%] ${isSentByCurrentUser ? 'self-end' : 'self-start'}`}
                            >

                            <Text className={isSentByCurrentUser ? "text-white": "text-black"}>
                                {item.content}
                            </Text>
                            <Text className={`text-xs mt-1 text-right opacity-60 ${isSentByCurrentUser ? "text-white": "text-black"}`}>
                                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                            </MyLinearGradient>

                            {isSentByCurrentUser && showAvatar && (
                            <UserAvatar
                                rating={currentUser.ratingStats?.averageScore || 3}
                                username={currentUser.username || ""}
                                profileImage={currentUser.profileImage}
                                sizePercent={8}
                                hasBorder={false}
                                className='ml-2'
                            />
                            )}
                            {isSentByCurrentUser && !showAvatar && <Box className="w-8 ml-2" />}
                        </Box>
                        );
                    }}
                    renderSectionHeader={({ section: { title } }) => (
                        <Box className="items-center my-4">
                        <Text className="bg-zinc-300 px-3 py-1 rounded-full text-sm text-zinc-700">
                            {format(new Date(title), 'dd MMM yyyy')}
                        </Text>
                        </Box>
                    )}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ padding: 12 }}
                    showsVerticalScrollIndicator={false}
                    // keyboardDismissMode="on-drag"
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    maintainVisibleContentPosition={{
                        minIndexForVisible: 0,
                        autoscrollToTopThreshold: 10
                    }}
                    ListEmptyComponent={ 
                        isLoading ?
                        <SpinnerLoader className='mt-10' /> :
                        <Box className='justify-center items-center mt-10'>
                            <Text className='p-4 color-indigo-600'>No Messages Yet. Be the first to send</Text>
                        </Box>
                    }
                />
            </Box>

            {/* Keyboard avoiding alternative */}
            <Box 
                className="flex-row w-full items-center px-4 py-2 gap-2"
                style={{
                marginBottom: keyboard.keyboardShown 
                    ? (Platform.OS === 'ios' ? insets.bottom : 255)
                    : 0
                }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Box className="flex-row items-center px-4 py-2 gap-2">
                        <TextInput
                            className="flex-1 bg-white rounded-full px-4 py-2"
                            placeholder="Message..."
                            placeholderTextColor="#aaa"
                            value={input}
                            onChangeText={setInput}
                        />
                        <MyLinearGradient type='button' color='turquoise-button' className='w-[100px]'>
                            <Button onPress={sendMessage} className="h-fit rounded-full">
                                <ButtonText className="text-white">Send</ButtonText>
                            </Button>
                        </MyLinearGradient>
                    </Box>
                </TouchableWithoutFeedback>
            </Box>
        </Box>
    );
};

export default MessageScreen;