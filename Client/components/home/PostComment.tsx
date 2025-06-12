import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IComment } from '@/types/commentTypes';
import { Box } from '../ui/box';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import { IC_Heart } from '@/utils/constants/Icons';
import { useDoublePress } from '@/hooks/useDoublePress';
import { Vibration } from 'react-native';
import UserAvatar from '../UserAvatar';
import { getTimeAgo } from '@/utils/functions/help';
import { createRating, deleteRating } from '@/utils/api/internal/ratingApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import RatingPopup from '../RatingPopup';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';

interface PostCommentProps {
    comment: IComment;
    handleAvatarPress: (userId: string) => void;
}
const PostComment = ({ comment, handleAvatarPress}: PostCommentProps) => {
    const currentUser = useSelector((state: RootState) => state.currentUser);
    // const navigation = useNavigation<NavigationProp<ParamListBase>>();
    const [isLiked, setIsLiked] = useState(false);
    const likes = comment.likes;
    const [showRatingPopup, setShowRatingPopup] = useState(false);
    const likeCount = isLiked ? likes.length + (!likes.includes(currentUser._id) ? 1 : 0) 
                            : likes.length - (likes.includes(currentUser._id) ? 1 : 0);

    useEffect(() => {
        setIsLiked(comment.likes.includes(currentUser._id));
    }, [comment.likes, currentUser._id]);

    const handleLike = (vibrate = false) => {
        if (vibrate) Vibration.vibrate(50);
    
        if(isLiked){
            setIsLiked(false);
            removeRating();
        } else {
            setIsLiked(true);
            setShowRatingPopup(true);
        }
    };

    const handleRating = async (value: number, type: "Post" | "Comment" | "User", targetId: string) => {
        console.log(value, type, targetId);
        if(value === 0) {
            if(!comment.likes.includes(currentUser._id)) 
                setIsLiked(false);
            return;
        }
        await createRating({ rating: value, targetType: type, targetId});
    }

    const removeRating = async () => {
        await deleteRating({targetType: "Comment", targetId: comment._id })
    }

    
    return (
    <Box className="flex-row py-2">
        <Box className="flex-row gap-4 flex-1">
            <Pressable
            onPress={() => handleAvatarPress(comment.author._id as string)}
            >
                <UserAvatar 
                    rating={comment.author.ratingStats?.averageScore || 3}
                    username={comment.author.username || ""}
                    profileImage={comment.author.profileImage}
                    sizePercent={12}
                />
            </Pressable>

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
                        <Text className="text-xs text-gray-500">{likeCount}</Text>
                    </Box>
                </Box>
                {/* Actions */}
                <Box className="flex-row gap-3">
                    <Text className="text-sm text-gray-500">Replay</Text>
                    <Text className="text-sm text-gray-500">Translate</Text>
                </Box>
            </Box>
        </Box>
        {showRatingPopup &&
            <RatingPopup 
            onRate={handleRating}
            targetId={comment._id}
            onClose={() => setShowRatingPopup(false)}
            type='Comment'
            />
        }

    </Box>
    )
}

export default PostComment