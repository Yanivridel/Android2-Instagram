import React, { useState } from 'react'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Image } from '@/components/ui/image'
import { Post } from '@/types/postTypes'
import { IC_Comment, IC_Heart, IC_Share, IC_Bookmark, IC_3DotsOptions, IC_Plus, IC_PersonMinus, IC_Info_Circle, IC_EyeOff, IC_AccountInfo, IC_Report } from '@/utils/constants/Icons'
import { AvatarFallbackText, AvatarImage } from '../ui/avatar'
import { Avatar } from '../ui/avatar'
import PostCommentSheet from './PostCommentSheet'
import TouchableIcon from '../TouchableIcon'
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu"
import { TouchableOpacity } from 'react-native'

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

        {/* Options Menu */}
        <Menu
          placement="bottom right"
          offset={10}
          trigger={({ ...triggerProps }) => {
            return (
              <TouchableOpacity {...triggerProps} activeOpacity={0.7}>
                  <IC_3DotsOptions className="h-5 w-5" color="gray"/>
              </TouchableOpacity>
            )
          }}
        >
          <MenuItem 
            className="gap-3"
            onPress={() => console.log("Add favorites")} 
            key="Add favorites"
            textValue='Add favorites'
          >
            <IC_Bookmark className="h-4 w-4"/>
            <MenuItemLabel size="sm">Add to favorites</MenuItemLabel>
          </MenuItem>
          <MenuItem 
            className="gap-3"
            onPress={() => console.log("Stop following")} 
            key="Stop following"
            textValue='Stop following'
          >
            <IC_PersonMinus className="h-5 w-5"/>
          <MenuItemLabel size="sm">Stop following</MenuItemLabel>
          </MenuItem>
          <MenuItem 
            className="gap-3"
            onPress={() => console.log("Why this post is shown")} 
            key="Why this post is shown"
            textValue='Why this post is shown'
          >
            <IC_Info_Circle className="h-5 w-5" />
            <MenuItemLabel size="sm">Why this post is shown</MenuItemLabel>
          </MenuItem>
          <MenuItem 
            className="gap-3"
            onPress={() => console.log("Hide post")} 
            key="Hide post"
            textValue='Hide post'
          >
            <IC_EyeOff className="h-5 w-5"/>
            <MenuItemLabel size="sm">Hide post</MenuItemLabel>
          </MenuItem>
          <MenuItem 
            className="gap-3"
            onPress={() => console.log("Account information")} 
            key="Account information"
            textValue='Account information'
          >
            <IC_AccountInfo className="h-6 w-6"/>
            <MenuItemLabel size="sm">Account information</MenuItemLabel>
          </MenuItem>
          <MenuItem 
            className="gap-3"
            onPress={() => console.log("Report post")} 
            key="Report post"
            textValue='Report post'
          >
            <IC_Report className="h-5 w-5" color="red"/>
            <MenuItemLabel className="text-red-500" size="sm">Report post</MenuItemLabel>
          </MenuItem>
        </Menu>
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
          <TouchableIcon Icon={IC_Heart} className="h-6 w-6" color="red"/>
          {/* Comment */}
          <PostCommentSheet showActionsheet={showCommentsSheet} setShowActionsheet={setShowCommentsSheet} />
          <TouchableIcon
            Icon={IC_Comment}
            className="h-6 w-6"
            onPress={() => setShowCommentsSheet(true)}
          />
          {/* Share */}
          <TouchableIcon Icon={IC_Share} className="h-6 w-6"/>
        </Box>
        {/* Bookmark */}
        <TouchableIcon Icon={IC_Bookmark} className="h-6 w-6"/>
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
