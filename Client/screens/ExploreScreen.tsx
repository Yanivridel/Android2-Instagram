import React, { useEffect, useState } from 'react';
import {
    FlatList,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { PostsGrid } from '@/components/post/PostsGrid';
import { Text } from '@/components/ui/text';
import { getAllPostsRandomized } from '@/utils/api/internal/postApi';
import { IPost } from '@/types/postTypes';
import SpinnerLoader from '@/components/SpinnerLoader';
import { Props } from '@/types/NavigationTypes';
import { getAutocompletePrefix } from '@/utils/api/internal/userApi';
import { IUser } from '@/types/userTypes';
import UserAvatar from '@/components/UserAvatar';
import { IGroup } from '@/types/groupTypes';
import MyLinearGradient from '@/components/gradient/MyLinearGradient';

const ExploreScreen = ({ navigation }: Props) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ users: IUser[]; groups: IGroup[] }>({ users: [], groups: [] });
    const [posts, setPosts] = useState<IPost[] | null>(null);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);

    useEffect(() => {
        getAllPostsRandomized().then(posts => {
            setPosts(posts);
            setIsLoadingPosts(false);
        });
    }, []);

    const handleResultPress = (id: string, type: 'user' | 'group') => {
        if (type === 'user') {
            navigation.navigate("MainApp", { screen: "Profile", params: { userId: id } });
        } else {
            navigation.navigate("MainApp", { screen: "Group", params: { groupId: id } });
        }
    };

    const handleQueryChange = async (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setSearchResults({ users: [], groups: [] });
            return;
        }

        const data = await getAutocompletePrefix({ prefix: query });
        setSearchResults({
            users: data?.users ?? [],
            groups: data?.groups ?? []
        });
    };

    const combinedResults = [
        ...(searchResults.users.length ? [{ type: 'label', label: 'Users' }] : []),
        ...searchResults.users.map(u => ({ type: 'user', item: u })),
        ...(searchResults.groups.length ? [{ type: 'label', label: 'Groups' }] : []),
        ...searchResults.groups.map(g => ({ type: 'group', item: g })),
    ];

    return (
        <Box className="flex-1 bg-white pt-4">
            {/* 🔍 Search Bar */}
            <Box className="relative">
                <Box className="mb-4 px-4">
                    <TextInput
                        className="w-full px-4 py-3 bg-gray-100 rounded-xl text-base text-black"
                        placeholder="Search posts or accounts..."
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={handleQueryChange}
                    />
                </Box>

                {searchQuery && combinedResults.length > 0 && (
                    <Box className="absolute top-16 left-0 right-0 bg-white rounded-b-xl shadow z-50 max-h-[80vh]">
                        <FlatList
                            data={combinedResults}
                            keyExtractor={(item: any, index) =>
                                item.type === 'label' ? `label-${item.label}-${index}` : `${item.item._id}-${item.type}`
                            }
                            renderItem={({ item }) => {
                                if (item.type === 'label') {
                                    return (
                                        <MyLinearGradient
                                            type='background'
                                            color='turquoise-button'
                                            className='rounded-full px-4 py-2 mx-2 w-fit'
                                            
                                        >
                                        {/* <Box className="px-4 py-2 bg-gray-100 rounded-full"> */}
                                            <Text className="text-[12px] font-bold text-white">
                                                {item.label}
                                            </Text>
                                        {/* </Box> */}
                                        </MyLinearGradient>
                                    );
                                }

                                const isUser = item.type === 'user';
                                const data = item.item;
                                return (
                                    <TouchableOpacity
                                        onPress={() => handleResultPress(data._id, item.type)}
                                        className="p-3 border-gray-200 flex-row items-center gap-4"
                                        activeOpacity={0.7}
                                    >
                                        <UserAvatar
                                            rating={isUser ? data.ratingStats?.averageScore || 3 : undefined}
                                            username={isUser ? data.username : data.name}
                                            profileImage={isUser ? data.profileImage : data.groupPicture}
                                            sizePercent={12}
                                        />
                                        <Text className="text-black">
                                            {isUser ? data.username : data.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                            showsVerticalScrollIndicator={false}
                        />
                    </Box>
                )}
            </Box>

            {/* 🖼️ Posts Grid */}
            <Box className="flex-1">
                {isLoadingPosts ? (
                    <SpinnerLoader />
                ) : posts ? (
                    <PostsGrid
                        posts={posts}
                        onPostPress={(post) =>
                            navigation.navigate("MainApp", {
                                screen: "Home",
                                params: {
                                    postId: post._id,
                                    post: post,
                                },
                            })
                        }
                    />
                ) : (
                    <Box className="justify-center items-center mt-5">
                        <Text className="p-4 color-indigo-600">No Posts Found</Text>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ExploreScreen;
