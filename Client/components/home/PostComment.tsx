import { View, Text } from 'react-native'
import React from 'react'
import { IComment } from '@/types/postTypes';
import { Box } from '../ui/box';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import { IC_Heart } from '@/utils/constants/Icons';


interface PostCommentProps {
    comment: IComment;
}
const PostComment = ({ comment }: PostCommentProps) => {
    console.log(comment);
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
                <Box className="flex-row gap-2 items-center">
                    <Text className="font-bold">{comment.user}</Text>
                    <Text className="text-sm text-gray-500">2h ago</Text>
                </Box>
                {/* Comment Text & Likes */}
                <Box className="p-1 flex-1 flex-row justify-between gap-3">
                    <Text className="text-gray-700 leading-5 flex-1">
                    {comment.text} Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas minus odio excepturi ullam rerum, ducimus eius illum, sequi quasi sit ad doloribus quaerat sed delectus quo aliquam nam unde repudiandae!
                    Amet asperiores corrupti totam quaerat laudantium! Earum minus iusto provident, expedita odio minima quos molestias voluptas veniam recusandae eligendi consectetur deleniti obcaecati cupiditate illum perspiciatis eum aut dolores, magnam magni.
                    </Text>

                    <Box>
                        <IC_Heart className="w-5 h-5"/>
                        <Text className="text-sm text-gray-500">302</Text>
                    </Box>
                </Box>
                {/* Actions */}
                <Box className="flex-row gap-3 ">
                    <Text className="text-sm text-gray-500">Replay</Text>
                    <Text className="text-sm text-gray-500">Translate</Text>
                </Box>
            </Box>
        </Box>
    </Box>
    )
}

export default PostComment