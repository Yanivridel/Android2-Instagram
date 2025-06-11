import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, Text } from 'react-native';
import { Box } from '@/components/ui/box';
import { Props } from '@/types/NavigationTypes';
import { IUser } from '@/types/userTypes';
import { getTop10Ratings } from '@/utils/api/internal/ratingApi';
import SpinnerLoader from '@/components/SpinnerLoader';
import UserAvatar from '@/components/UserAvatar';
import { cn } from '@/components/ui/cn';

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

const LeaderboardScreen = ({ navigation }: Props) => {
    const [ Leaderboard, setLeaderboard] = useState<IUser[] | null>(null);
    const [ isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getTop10Ratings()
        .then(Leaderboard => {
            setLeaderboard(Leaderboard);
        })
        .finally(() => setIsLoading(false));
    }, []);

    if(isLoading)
        return <SpinnerLoader />

    return (
        <Box className="flex-1 bg-white pt-10 px-4">
        <FlatList
            data={Leaderboard}
            keyExtractor={(item) => item._id}
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
                <Pressable className={cn("gap-3",baseStyle)}
                    onPress={() => navigation.navigate("MainApp", { screen: "Profile", params: { userId: item._id }})}
                >
                <UserAvatar
                    rating={item.ratingStats?.averageScore || 3}
                    username={item.username || ""}
                    profileImage={item.profileImage}
                    sizePercent={15}
                />
                <Box className="flex-1">
                    <Text className={`${textSize} font-semibold text-black`}>
                    {index + 1}. {item.username}
                    </Text>
                    <Text className="text-gray-500">{item.ratingStats.averageScore} ⭐</Text>
                </Box>
                </Pressable>
            );
            }}
            showsVerticalScrollIndicator={false}
        />
        </Box>
    );
};

export default LeaderboardScreen;
