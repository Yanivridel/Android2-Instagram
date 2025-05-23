import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import React, { useState } from 'react'
import { IComment } from '@/types/postTypes';
import { Box } from '../ui/box';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import { IC_Heart } from '@/utils/constants/Icons';
import { useDoublePress } from '@/hooks/useDoublePress';


interface PostCommentProps {
    comment: IComment;
}
const PostComment = ({ comment }: PostCommentProps) => {
    const [isLiked, setIsLiked] = useState(false);

    return (
    <Box className="flex-row py-2">
        <Box className="flex-row gap-4 flex-1">
            <Avatar className="bg-indigo-600 border-[2.5px] border-indigo-400">
                <AvatarFallbackText className="text-white">
                {comment.user}
                </AvatarFallbackText>
                <AvatarImage
                source={{
                    uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
                }}
                alt="User Avatar"
                />
            </Avatar>
            <Box className="gap-1 flex-1">
                {/* Comment Header */}
                <Box className="flex-row gap-2 items-end">
                    <Text className="font-bold">{comment.user}</Text>
                    <Text className="text-sm text-gray-500">2h ago</Text>
                </Box>
                {/* Comment Text & Likes */}
                <Box className="p-1 flex-1 flex-row justify-between gap-3 ">
                    <Pressable 
                        className="flex-1"
                        onPress={useDoublePress(() => setIsLiked(true))}
                    >
                        <Text 
                            className="text-gray-700 leading-5 "
                        >
                            {comment.text}
                        </Text>
                    </Pressable>

                    <Box className="items-center gap-1">
                        <TouchableOpacity 
                            onPress={() => setIsLiked(!isLiked)}
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