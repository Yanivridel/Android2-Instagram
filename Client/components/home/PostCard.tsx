import React from 'react'
import { Image, Text, TouchableOpacity } from 'react-native'
import { Box } from '@/components/ui/box'
import { Post } from '@/types/postTypes'

/**
 * PostCard component to render an Instagram-style post
 * @param {{ post: { id: string, user: { name: string, avatar: string }, image: string, caption: string, likes: number, timestamp: string } }} props
 */
type PostCardProps = {
    post: Post
}

const PostCard = ({ post }: PostCardProps) => {
  const { user, image, caption, likes, timestamp } = post

  return (
    <Box className="bg-card-light dark:bg-card-dark rounded-lg">
      {/* Header: Avatar, Username, Menu */}
      <Box className="flex-row items-center justify-between px-4 py-2">
        <Box className="flex-row items-center">
          <Image
            source={{ uri: user.avatar }}
            className="h-8 w-8 rounded-full"
          />
          <Text className="ml-2 text-[15px] font-medium text-text-light dark:text-text-dark">
            {user.name}
          </Text>
        </Box>
        <TouchableOpacity>
          <Image
            source={require('@/assets/favicon.png')}
            className="h-5 w-5"
          />
        </TouchableOpacity>
      </Box>

      {/* Post Image */}
      <Image
        source={{ uri: image }}
        className="w-full aspect-square"
        resizeMode="cover"
      />

      {/* Actions: Like, Comment, Share, Bookmark */}
      <Box className="flex-row items-center justify-between px-4 py-2">
        <Box className="flex-row items-center space-x-4">
          <TouchableOpacity>
            <Image
              source={require('@/assets/favicon.png')}
              className="h-6 w-6"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('@/assets/favicon.png')}
              className="h-6 w-6"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('@/assets/favicon.png')}
              className="h-6 w-6"
            />
          </TouchableOpacity>
        </Box>
        <TouchableOpacity>
          <Image
            source={require('@/assets/favicon.png')}
            className="h-6 w-6"
          />
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
