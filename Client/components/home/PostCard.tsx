import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Image } from '@/components/ui/image'
import { Post } from '@/types/postTypes'
import { IC_Comment, IC_Heart, IC_Share, IC_Bookmark, IC_3DotsOptions } from '@/utils/constants/Icons'
import { AvatarFallbackText, AvatarImage } from '../ui/avatar'
import { Avatar } from '../ui/avatar'
import PostCommentSheet from './PostCommentSheet'

/**
 * PostCard component to render an Instagram-style post
 * @param {{ post: { id: string, user: { name: string, avatar: string }, image: string, caption: string, likes: number, timestamp: string } }} props
 */
type PostCardProps = {
    post: Post
}

const PostCard = ({ post }: PostCardProps) => {
  const { user, image, caption, likes, timestamp } = post
  const [showCommentsSheet, setShowCommentsSheet] = useState(false);

  return (
    <Box className="bg-white dark:bg-card-dark rounded-lg">
      {/* Header: Avatar, Username, Menu */}
      <Box className="flex-row items-center justify-between px-4 py-2">
        <Box className="flex-row items-center">
          <Avatar className="bg-indigo-600 border-[2.5px] border-indigo-400">
            <AvatarFallbackText className="text-white">
              {user.name}
            </AvatarFallbackText>
            <AvatarImage
              source={{
                uri: user.avatar,
              }}
              alt="User Avatar"
            />
          </Avatar>
          <Text className="ml-2 text-[15px] font-medium text-text-light dark:text-text-dark">
            {user.name}
          </Text>
        </Box>
        <TouchableOpacity>
          <IC_3DotsOptions className="h-5 w-5" color="gray"/>
        </TouchableOpacity>
      </Box>

      {/* Post Image */}
      <Image
        source={{ uri: image}}
        className="w-full h-fit aspect-square"
        resizeMode="cover"
        alt="Post Image"
      />

      {/* Actions: Like, Comment, Share, Bookmark */}
      <Box className="flex-row items-center justify-between px-4 py-2">
        <Box className="flex-row gap-3">
          {/* Like */}
          <TouchableOpacity>
            <IC_Heart className="h-6 w-6" color="red"/>
          </TouchableOpacity>
          {/* Comment */}
          <TouchableOpacity onPress={() => setShowCommentsSheet(true)}>
            <PostCommentSheet showActionsheet={showCommentsSheet} setShowActionsheet={setShowCommentsSheet} />
            <IC_Comment className="h-6 w-6"/>
          </TouchableOpacity>
          {/* Share */}
          <TouchableOpacity>
            <IC_Share className="h-6 w-6"/>
          </TouchableOpacity>
        </Box>
        {/* Bookmark */}
        <TouchableOpacity>
          <IC_Bookmark className="h-6 w-6"/>
        </TouchableOpacity>
      </Box>

      {/* Likes, Caption, Timestamp */}
      <Box className="px-4 pb-3">
        <Text className="text-[15px] font-semibold text-text-light dark:text-text-dark">
          {likes} likes
        </Text>
        <Box className="flex-row mt-1">
          <Text className="font-medium text-text-light dark:text-text-dark mr-1">
            {user.name}
          </Text>
          <Text className="flex-shrink text-[15px] text-text-light dark:text-text-dark">
            {caption}
          </Text>
        </Box>
        <Text className="mt-1 text-[12px] text-subText-light dark:text-subText-dark">
          {timestamp}
        </Text>
      </Box>
    </Box>
  )
}

export default PostCard
