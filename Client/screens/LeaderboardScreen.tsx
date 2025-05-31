import React from 'react';
import { FlatList, Image, Text } from 'react-native';
import { Box } from '@/components/ui/box';

const dummyLeaderboard = [
    { id: '1', username: 'champion01', avatar: 'https://i.pravatar.cc/150?img=1', score: 3200 },
    { id: '2', username: 'elite_girl', avatar: 'https://i.pravatar.cc/150?img=2', score: 2900 },
    { id: '3', username: 'pro_guy', avatar: 'https://i.pravatar.cc/150?img=3', score: 2700 },
    { id: '4', username: 'mvp_2025', avatar: 'https://i.pravatar.cc/150?img=4', score: 2600 },
    { id: '5', username: 'queen_bee', avatar: 'https://i.pravatar.cc/150?img=5', score: 2500 },
    { id: '6', username: 'legendary', avatar: 'https://i.pravatar.cc/150?img=6', score: 2400 },
    { id: '7', username: 'sunny_side', avatar: 'https://i.pravatar.cc/150?img=7', score: 2300 },
    { id: '8', username: 'dark_knight', avatar: 'https://i.pravatar.cc/150?img=8', score: 2200 },
    { id: '9', username: 'firestorm', avatar: 'https://i.pravatar.cc/150?img=9', score: 2100 },
    { id: '10', username: 'last_hope', avatar: 'https://i.pravatar.cc/150?img=10', score: 2000 },
];

const LeaderboardScreen = () => {
    return (
        <Box className="flex-1 bg-white pt-10 px-4">
        <FlatList
            data={dummyLeaderboard}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
            const isFirst = index === 0;
            const isSecond = index === 1;

            const baseStyle = isFirst
                ? 'flex-row items-center bg-purple-100 px-4 py-5 rounded-2xl mb-3'
                : isSecond
                ? 'flex-row items-center bg-purple-50 px-4 py-4 rounded-xl mb-3'
                : 'flex-row items-center bg-gray-50 px-4 py-3 rounded-lg mb-2';

            const textSize = isFirst
                ? 'text-xl'
                : isSecond
                ? 'text-lg'
                : 'text-base';

            return (
                <Box className={baseStyle}>
                <Image
                    source={{ uri: item.avatar }}
                    className={`w-${isFirst ? '16' : isSecond ? '14' : '10'} h-${isFirst ? '16' : isSecond ? '14' : '10'} rounded-full mr-4`}
                />
                <Box className="flex-1">
                    <Text className={`${textSize} font-semibold text-black`}>
                    #{index + 1} {item.username}
                    </Text>
                    <Text className="text-gray-500">{item.score} points</Text>
                </Box>
                </Box>
            );
            }}
            showsVerticalScrollIndicator={false}
        />
        </Box>
    );
};

export default LeaderboardScreen;
