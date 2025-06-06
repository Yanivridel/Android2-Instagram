import React from 'react';
import { FlatList } from 'react-native';
import { PostCube } from './PostCube';
import { IPost } from '@/types/postTypes';


type PostsGridProps = {
    posts: IPost[];
    onPostPress: (post: IPost) => void;
};

export const PostsGrid: React.FC<PostsGridProps> = ({ posts, onPostPress }) => {
    return (
    <FlatList
        className="flex-1"
        data={posts}
        keyExtractor={(post) => post._id}
        numColumns={3}
        renderItem={({ item }) => (
            <PostCube imageUrl={item.imageUrls[0]} onPress={() => onPostPress(item)} />
        )}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        bounces={true}
    />
    );
};
