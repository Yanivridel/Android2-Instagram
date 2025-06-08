import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import React, { useState } from 'react'
import { IComment } from '@/types/commentTypes';
import { Box } from '../ui/box';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import { IC_Heart } from '@/utils/constants/Icons';
import { useDoublePress } from '@/hooks/useDoublePress';
import { Vibration } from 'react-native';
import UserAvatar from '../UserAvatar';
import { getTimeAgo } from '@/utils/functions/help';

interface PostCommentProps {
    comment: IComment;
}
const PostComment = ({ comment }: PostCommentProps) => {
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = ( vibrate=false ) => {
        if(vibrate) Vibration.vibrate(50);
        setIsLiked(prev => !prev);
    }

    return (
    <Box className="flex-row py-2">
        <Box className="flex-row gap-4 flex-1">
            <UserAvatar 
                rating={comment.author.ratingStats?.averageScore || 3}
                username={comment.author.username || ""}
                profileImage={comment.author.profileImage}
                sizePercent={12}
            />
            <Box className="gap-1 flex-1">
                {/* Comment Header */}
                <Box className="flex-row gap-2 items-end">
                    <Text className="font-bold">{comment.author.username}</Text>
                    <Text className="text-sm text-gray-500">{getTimeAgo(String(comment.createdAt))}</Text>
                </Box>
                {/* Comment Text & Likes */}
                <Box className="p-1 flex-1 flex-row justify-between gap-3 ">
                    <Pressable 
                        className="flex-1"
                        onPress={useDoublePress(() => handleLike(true))}
                    >
                        <Text 
                            className="text-gray-700 leading-5 "
                        >
                            {comment.content}
                        </Text>
                    </Pressable>

                    <Box className="items-center gap-1">
                        <TouchableOpacity 
                            onPress={() => handleLike(false)}
                            activeOpacity={0.7}
                        >
                            <IC_Heart className={`w-4 h-4 `} color={isLiked ? '#ef4444' : ''} />
                        </TouchableOpacity>
                        <Text className="text-xs text-gray-500">302</Text>
                    </Box>
                </Box>
                {/* Actions */}
                <Box className="flex-row gap-3">
                    <Text className="text-sm text-gray-500">Replay</Text>
                    <Text className="text-sm text-gray-500">Translate</Text>
                </Box>
            </Box>
        </Box>
    </Box>
    )
}

export default PostComment