import React, { useState } from 'react';
import { FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { Props } from '@/types/NavigationTypes';

const mockChats = [
  {
    id: '1',
    name: 'Emily R.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: 'Hey! Are you coming tonight?',
  },
  {
    id: '2',
    name: 'Jordan M.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastMessage: 'Got the files, thanks!',
  },
  {
    id: '3',
    name: 'Olivia T.',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    lastMessage: 'Haha yes! 😂',
  },
];

const ChatScreen: React.FC<Props> = () => {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const [search, setSearch] = useState('');
    const [chats, setChats] = useState(mockChats);
    
    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(search.toLowerCase())
    );

    const renderItem = ({ item }: { item: typeof mockChats[0] }) => (
            <TouchableOpacity
                onPress={() => navigation.navigate("MainApp", { screen:'MessageScreen', userId: item.id })}
                className="flex-row items-center px-4 py-3"
            >
            <Avatar className="bg-indigo-600 border-[2.5px] border-indigo-400">
                <AvatarFallbackText className="text-white">
                {item.name}
                </AvatarFallbackText>
                <AvatarImage
                source={{
                    uri: item.avatar,
                }}
                alt="User Avatar"
                />
        </Avatar>
            <Box className="ml-4 flex-1 border-b border-gray-200 pb-3">
                <Text className="text-base font-semibold">{item.name}</Text>
                <Text className="text-sm text-gray-500 truncate">{item.lastMessage}</Text>
            </Box>
            </TouchableOpacity>
    );

    return (
        <Box className="flex-1 bg-white">
        <Box className="p-4">
            <TextInput
            placeholder="Search"
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
            className="bg-gray-100 px-4 py-2 rounded-full text-base"
            />
        </Box>
        <FlatList
            data={filteredChats}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
        />
        </Box>
    );
};

export default ChatScreen;
