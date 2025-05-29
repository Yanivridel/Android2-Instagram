import React from 'react';
import { FlatList } from 'react-native';
import { PostCube } from './PostCube';

type Post = {
    id: string;
    imageUrl: string;
};

type PostsGridProps = {
    posts: Post[];
    onPostPress: (post: Post) => void;
};

export const PostsGrid: React.FC<PostsGridProps> = ({ posts, onPostPress }) => {
    return (
    <FlatList
        className="flex-1"
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
            <PostCube imageUrl={item.imageUrl} onPress={() => onPostPress(item)} />
        )}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        bounces={true}
    />
    );
};
