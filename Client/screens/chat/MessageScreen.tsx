import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FlatList, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
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

const socket = io('http://192.168.1.100:3000');

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
    const flatListRef = useRef<FlatList>(null);
    const shouldAutoScroll = useRef(true);    

    // Debounced scroll to end function
    const scrollToEnd = useCallback(() => {
        setTimeout(() => {
            if (flatListRef.current && shouldAutoScroll.current) {
                flatListRef.current.scrollToEnd({ animated: true });
            }
        }, 100);
    }, []);

    // Load initial messages first, then set up socket
    useEffect(() => {
        const loadMessages = async () => {
            try {
                setIsLoading(true);
                const initialMessages = await getMessageByChatId({ chatId });

                const normalizedMessages = (initialMessages || []).map((msg: any) => {
                    const isSentByCurrentUser = msg.senderId === currentUser._id;
                
                    return {
                        ...msg,
                        senderId: isSentByCurrentUser
                            ? currentUser // full object already from Redux
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
                });

                setMessages(normalizedMessages || []);
                
                // Join socket room after messages are loaded
                socket.emit('join', chatId);
                
                // Set up socket listener
                const handleNewMessage = (message: IMessage) => {
                    setMessages(prev => {
                        // Prevent duplicate messages
                        const exists = prev.some(msg => 
                            msg._id === message._id || 
                            (msg.createdAt === message.createdAt && msg.senderId._id === message.senderId._id)
                        );
                        if (exists) return prev;
                        
                        return [...prev, message];
                    });
                    
                    // Auto scroll for new messages
                    scrollToEnd();
                };
                
                socket.on('message', handleNewMessage);
                
                // Initial scroll after messages load
                scrollToEnd();
                
            } catch (error) {
                console.error('Error loading messages:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadMessages();

        return () => {
            socket.emit('leave', chatId);
            socket.off('message');
        };
    }, [chatId, scrollToEnd]);

    const sendMessage = () => {
        if (!input.trim()) return;

        const message = {
            content: input,
            senderId: currentUser,
            recipientId: otherUser._id || "",
            chatId,
            createdAt: new Date().toISOString(),
        };

        socket.emit('send-message', { chatId, message });        
        
        // Add message optimistically
        setMessages(prev => [...prev, message]);
        createMessage({content: message.content, recipientId: message.recipientId })
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

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 35}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Box className="flex-1 bg-indigo-100">
                    {/* Top Bar */}
                    <MyLinearGradient type='background' color='purple'>
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
                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            keyExtractor={(item, index) => item._id ?? `${item.createdAt}_${index}`}
                            renderItem={({ item, index }) => {
                                const isSentByCurrentUser = item.senderId._id === currentUser._id;
                                const showAvatar =
                                    index === 0 || messages[index - 1].senderId._id !== item.senderId._id;
                        
                                return (
                                    <Box
                                        className={`flex-row mb-2 ${
                                            isSentByCurrentUser ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        {/* Avatar (only for received messages and if needed) */}
                                        {!isSentByCurrentUser && showAvatar && (
                                            <UserAvatar
                                                rating={otherUser.ratingStats?.averageScore || 3}
                                                username={otherUser.username || ""}
                                                profileImage={otherUser.profileImage}
                                                sizePercent={8}
                                                hasBorder={false}
                                                className='mr-2'
                                            />
                                            
                                            // <Image
                                            //     source={{
                                            //         uri: item.senderId.profileImage || `https://i.pravatar.cc/150?u=${item.senderId._id}`,
                                            //     }}
                                            //     className="w-8 h-8 rounded-full mr-2 mt-auto"
                                            // />
                                        )}
                        
                                        {/* Empty space if no avatar but align with message bubble */}
                                        {!isSentByCurrentUser && !showAvatar && (
                                            <Box className="w-8 mr-2" />
                                        )}
                        
                                        {/* Message Bubble */}
                                        <Box
                                            className={`px-4 py-2 max-w-[75%] rounded-2xl ${
                                                isSentByCurrentUser
                                                    ? 'bg-violet-600'
                                                    : 'bg-zinc-700'
                                            } ${
                                                isSentByCurrentUser ? 'self-end' : 'self-start'
                                            }`}
                                        >
                                            <Text className="text-white">{item.content}</Text>
                                        </Box>
                        
                                        {/* Avatar for current user */}
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
                                        {isSentByCurrentUser && !showAvatar && (
                                            <Box className="w-8 ml-2" />
                                        )}
                                    </Box>
                                );
                            }}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={{ padding: 12 }}
                            showsVerticalScrollIndicator={false}
                            keyboardDismissMode="on-drag"
                            onScroll={handleScroll}
                            scrollEventThrottle={16}
                            maintainVisibleContentPosition={{
                                minIndexForVisible: 0,
                                autoscrollToTopThreshold: 10
                            }}
                            ListEmptyComponent={<SpinnerLoader className='mt-10'/>}
                        />
                    </Box>
            
                    {/* Input */}
                    <Box className="flex-row items-center px-4 py-2 gap-2">
                        <TextInput
                            className="flex-1 bg-white rounded-full px-4 py-2"
                            placeholder="Message..."
                            placeholderTextColor="#aaa"
                            value={input}
                            onChangeText={setInput}
                        />
                        <MyLinearGradient type='button' color='purple' className='w-[100px]'>
                            <Button onPress={sendMessage} className="h-fit rounded-full">
                                <ButtonText className="text-white">Send</ButtonText>
                            </Button>
                        </MyLinearGradient>
                    </Box>
                </Box>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default MessageScreen;