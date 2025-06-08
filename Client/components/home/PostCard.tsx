import React, { useEffect, useRef, useState } from 'react'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Image } from '@/components/ui/image'
import { IPost } from '@/types/postTypes'
import { IC_Comment, IC_Heart, IC_Share, IC_Bookmark, IC_3DotsOptions, IC_Plus, IC_PersonMinus, IC_Info_Circle, IC_EyeOff, IC_AccountInfo, IC_Report } from '@/utils/constants/Icons'
import { AvatarFallbackText, AvatarImage } from '../ui/avatar'
import { Avatar } from '../ui/avatar'
import PostCommentSheet from './PostCommentSheet'
import TouchableIcon from '../TouchableIcon'
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu"
import { Animated, Easing, Pressable, TouchableOpacity, Vibration } from 'react-native'
import ShareSheet from './ShareSheet'
import { useDoublePress } from '@/hooks/useDoublePress'
import { getTimeAgo, isVideo } from '@/utils/functions/help'
import { ResizeMode, Video  } from 'expo-av'; 

/**
 * PostCard component to render an Instagram-style post
 * @param {{ post: { id: string, user: { name: string, avatar: string }, image: string, caption: string, likes: number, timestamp: string } }} props
 */
type PostCardProps = {
    post: IPost
}

const PostCard = ({ post }: PostCardProps) => {
  const { author, imageUrls, content, likes, createdAt } = post
  const [showCommentsSheet, setShowCommentsSheet] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [showHeart, setShowHeart] = useState(false);
  const videoRef = useRef<Video>(null);
  let animTimeout: NodeJS.Timeout | null = null;

  useEffect(() => {
    return () => {
      if (videoRef.current?.unloadAsync) {
        videoRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const handleLike = ( vibrate=false ) => {
    if(vibrate) Vibration.vibrate(50);
    setIsLiked(true);
    triggerHeartAnimation();
  }

  const triggerHeartAnimation = () => {
    scaleAnim.stopAnimation();
    scaleAnim.setValue(0);
    setShowHeart(true);
  
    if (animTimeout) clearTimeout(animTimeout);
  
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        delay: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      animTimeout = setTimeout(() => {
        setShowHeart(false);
      }, 50);
    });
  };

  return (
    <Box className="bg-white dark:bg-card-dark rounded-lg">
      {/* Header: Avatar, Username, Menu */}
      <Box className="flex-row items-center justify-between px-4 py-2">
        <Box className="flex-row items-center">
          <Avatar className="bg-indigo-600 border-[2.5px] border-indigo-400">
            <AvatarFallbackText className="text-white">
              {author.username}
            </AvatarFallbackText>
            <AvatarImage
              source={{
                uri: author.profileImage,
              }}
              alt="User Avatar"
            />
          </Avatar>
          <Box className='ml-2'>
            <Text className="text-[15px] font-medium text-text-light dark:text-text-dark">
              {author.username}
            </Text>
            {post.locationString &&
              <Text className="text-sm text-gray-500">
                {post.locationString}
              </Text>
            }
          </Box>
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
      <Pressable onPress={useDoublePress(() => handleLike(true))}>
        <Box className="relative w-full aspect-square overflow-hidden rounded-md">
          {isVideo(imageUrls[0]) ? (
            <Video
              ref={videoRef}
              key={`post-video-${imageUrls[0]}`}
              source={{ uri: imageUrls[0] }}
              resizeMode={ResizeMode.COVER}
              shouldPlay={true}
              isLooping={true}
              isMuted={false}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <Image
              key={`post-image-${imageUrls[0]}`}
              source={{ uri: imageUrls[0] }}
              className="w-full h-full"
              resizeMode="cover"
              alt={`Post Media`}
            />
          )}

          {showHeart && (
            <Animated.View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: [
                  { translateX: -50 },
                  { translateY: -50 },
                  { scale: scaleAnim },
                ],
                opacity: scaleAnim,
              }}
            >
              <IC_Heart color="red" className="w-32 h-32" />
            </Animated.View>
          )}
        </Box>
      </Pressable>

      {/* Actions: Like, Comment, Share, Bookmark */}
      <Box className="flex-row items-center justify-between px-4 py-2">
        <Box className="flex-row gap-3">
          {/* Like */}
          <TouchableIcon
            Icon={IC_Heart}
            className="h-6 w-6" 
            color={isLiked ? "red" : ""}
            onPress={() => setIsLiked(!isLiked)}
          />
          {/* Comment */}
          <PostCommentSheet 
            showActionsheet={showCommentsSheet}
            setShowActionsheet={setShowCommentsSheet} 
            postId={post._id}
            />
          <TouchableIcon
            Icon={IC_Comment}
            className="h-6 w-6"
            onPress={() => setShowCommentsSheet(true)}
          />
          {/* Share */}
          <ShareSheet isOpen={showShareSheet} onClose={() => setShowShareSheet(false)} />

          <TouchableIcon 
            Icon={IC_Share}
            onPress={() => setShowShareSheet(true)}
            className="h-6 w-6" 
          />
        </Box>
        {/* Bookmark */}
        <TouchableIcon 
          Icon={IC_Bookmark} 
          className="h-6 w-6"
          onPress={() => setIsSaved(!isSaved)}
          color={isSaved ? "#f6b530" : ""}
        />
      </Box>

      {/* Likes, Caption, Timestamp */}
      <Box className="px-4 pb-3">
        <Text className="text-[15px] font-semibold text-text-light dark:text-text-dark">
          {likes.length} likes
        </Text>
        <Box className="flex-row mt-1">
          <Text className="font-medium text-text-light dark:text-text-dark mr-1">
            {author.username}
          </Text>
          <Text className="flex-shrink text-[15px] text-text-light dark:text-text-dark">
            {content}
          </Text>
        </Box>
        <Text className="mt-1 text-[12px] text-subText-light dark:text-subText-dark">
          {`Posted ${getTimeAgo(createdAt)}`}
        </Text>
      </Box>
    </Box>
  )
}

export default PostCard
