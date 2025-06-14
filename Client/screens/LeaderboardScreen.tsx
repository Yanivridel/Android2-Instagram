import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, Text } from 'react-native';
import { Box } from '@/components/ui/box';
import { Props } from '@/types/NavigationTypes';
import { IUser } from '@/types/userTypes';
import { getTop10Ratings } from '@/utils/api/internal/ratingApi';
import SpinnerLoader from '@/components/SpinnerLoader';
import UserAvatar from '@/components/UserAvatar';
import { cn } from '@/components/ui/cn';

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
