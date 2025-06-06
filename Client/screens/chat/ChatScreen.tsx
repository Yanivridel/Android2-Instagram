import React, { useEffect, useState } from 'react';
import { FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { Props } from '@/types/NavigationTypes';
import { IChat } from '@/types/chatTypes';
import { getAllChats } from '@/utils/api/internal/chatApi';
import SpinnerLoader from '@/components/SpinnerLoader';


const ChatScreen: React.FC<Props> = () => {
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const [search, setSearch] = useState('');
    const [chats, setChats] = useState<IChat[] | null>(null);
    
    const filteredChats = chats?.filter(chat =>
        chat.participants[0].username.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        getAllChats()
        .then(chats => {
            setChats(chats);
        });
    }, [])

    const renderItem = ({ item: chat }: { item: IChat }) => (
            <TouchableOpacity
                onPress={() => 
                    navigation.navigate("MainApp", {
                        screen: "MessageScreen",
                        params: {
                            chatId: chat._id,
                            user: chat.participants[0]
                        },
                    })
                }
                className="flex-row items-center px-4 py-3"
                activeOpacity={0.8}
            >
            <Avatar className="bg-indigo-600 border-[2.5px] border-indigo-400">
                <AvatarFallbackText className="text-white">
                {chat.participants[0].username}
                </AvatarFallbackText>
                <AvatarImage
                source={{
                    uri: chat.participants[0].profileImage,
                }}
                alt="User Avatar"
                />
        </Avatar>
            <Box className="ml-4 flex-1 border-b border-gray-200 pb-3">
                <Text className="text-base font-semibold">{chat.participants[0].username}</Text>
                { chat.lastMessage ?
                <Text className="text-sm text-gray-500 truncate">{chat.lastMessage.content}</Text>
                :
                <Text>Start new conversation...</Text>
                }
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
            keyExtractor={item => item._id}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<SpinnerLoader className='mt-10'/>}
        />
        </Box>
    );
};

export default ChatScreen;
