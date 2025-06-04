import React, { useEffect, useRef, useState } from 'react';
import { FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import io from 'socket.io-client';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const socket = io('http://192.168.1.100:3000');

interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
}

interface MessageScreenProps {
    route: {
        params: {
        chatId: string;
        userId: string; // Current user
        recipientId: string;
        };
    };
}

const MessageScreen: React.FC<MessageScreenProps> = ({ route }) => {
    const { chatId, userId } = route.params;
    const currentUser = useSelector((state: RootState) => state.currentUser); 
    const recipientId = currentUser._id; 
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        socket.emit('join', chatId);

        socket.on('message', (message: Message) => {
        setMessages(prev => [...prev, message]);
        });

        return () => {
        socket.emit('leave', chatId);
        socket.off('message');
        };
    }, [chatId]);

    const sendMessage = () => {
        if (!input.trim()) return;

        const message: Message = {
        id: Date.now().toString(),
        senderId: userId,
        content: input,
        timestamp: new Date().toISOString(),
        };

        socket.emit('send-message', { chatId, message });
        setMessages(prev => [...prev, message]);
        setInput('');
        flatListRef.current?.scrollToEnd({ animated: true });
    };

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-black"
        >
        <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <Box className={`px-4 py-2 my-1 max-w-[80%] rounded-2xl ${
                item.senderId === userId ? 'bg-violet-600 self-end' : 'bg-gray-700 self-start'
            }`}>
                <Text className="text-white">{item.content}</Text>
            </Box>
            )}
            contentContainerStyle={{ padding: 12 }}
        />

        <Box className="flex-row items-center px-4 py-2 border-t border-gray-800 bg-black">
            <TextInput
            className="flex-1 bg-zinc-900 text-white rounded-full px-4 py-2"
            placeholder="Message..."
            placeholderTextColor="#aaa"
            value={input}
            onChangeText={setInput}
            />
            <Button onPress={sendMessage} className="ml-2 bg-violet-600 px-4 py-2 rounded-full">
            <Text className="text-white">Send</Text>
            </Button>
        </Box>
        </KeyboardAvoidingView>
    );
};

export default MessageScreen;
