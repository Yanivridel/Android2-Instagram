import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { PostCube } from './PostCube';
import { IPost } from '@/types/postTypes';

type PostsGridProps = {
    posts: IPost[];
    onPostPress: (post: IPost) => void;
};

export const PostsGrid: React.FC<PostsGridProps> = ({ posts, onPostPress }) => {
    // Memoize the render function to prevent unnecessary re-renders
    const renderPost = useCallback(({ item: post }: { item: IPost }) => (
        <PostCube 
            imageUrl={post.imageUrls[0]} 
            onPress={() => onPostPress(post)} 
        />
    ), [onPostPress]);

    // Memoize the key extractor
    const keyExtractor = useCallback((post: IPost) => `post-grid-${post._id}`, []);

    return (
        <FlatList
            className="flex-1"
            data={posts}
            keyExtractor={keyExtractor}
            numColumns={3}
            renderItem={renderPost}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            bounces={true}
            // Performance optimizations
            removeClippedSubviews={true} // Remove off-screen items from memory
            maxToRenderPerBatch={9} // Render 3 rows at a time (3x3 grid)
            initialNumToRender={12} // Render 4 rows initially
            windowSize={10} // Keep 10 screens worth of items in memory
            getItemLayout={(data, index) => ({
                length: screenWidth / 3,
                offset: (screenWidth / 3) * Math.floor(index / 3),
                index,
            })}
        />
    );
};

// Add this at the top of the file
const screenWidth = require('react-native').Dimensions.get('window').width;