import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Image } from '@/components/ui/image'
import { IPost } from '@/types/postTypes'
import { IC_Comment, IC_Heart, IC_Share, IC_Bookmark, IC_3DotsOptions, IC_Plus, IC_PersonMinus, IC_Info_Circle, IC_EyeOff, IC_AccountInfo, IC_Report, IC_Vi } from '@/utils/constants/Icons'
import { AvatarFallbackText, AvatarImage } from '../ui/avatar'
import { Avatar } from '../ui/avatar'
import PostCommentSheet from './PostCommentSheet'
import TouchableIcon from '../TouchableIcon'
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu"
import { Animated, Easing, Pressable, TextInput, TouchableOpacity, Vibration } from 'react-native'
import ShareSheet from './ShareSheet'
import { useDoublePress } from '@/hooks/useDoublePress'
import { getTimeAgo, isVideo } from '@/utils/functions/help'
import { ResizeMode, Video, AVPlaybackStatus } from 'expo-av'
import { NavigationProp, ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { deletePost, updatePost } from '@/utils/api/internal/postApi'
import MyModal from '../MyModal'
import RatingPopup from '../RatingPopup'
import { createRating, deleteRating } from '@/utils/api/internal/ratingApi'

/**
 * PostCard component to render an Instagram-style post
 * @param {{ post: { id: string, user: { name: string, avatar: string }, image: string, caption: string, likes: number, timestamp: string } }} props
 */
type PostCardProps = {
    post: IPost
}

const PostCard = ({ post }: PostCardProps) => {
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const { author, imageUrls, content, likes, createdAt } = post
  const [showCommentsSheet, setShowCommentsSheet] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [postEdit, setPostEdit] = useState(false);
  const [editContent, setEditContent] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [showHeart, setShowHeart] = useState(false);
  const videoRef = useRef<Video>(null);
  let animTimeout: NodeJS.Timeout | null = null;
  const isMyPost = post.author._id === currentUser._id;
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const likeCount = isLiked ? likes.length + (!post.likes.includes(currentUser._id) ? 1 : 0) 
                          : likes.length - (post.likes.includes(currentUser._id) ? 1 : 0);

  // Cleanup video and animations on unmount
  useEffect(() => {
    return () => {
      if (animTimeout) {
        clearTimeout(animTimeout);
      }
      if (videoRef.current) {
        videoRef.current.unloadAsync().catch(() => {
          // Silent cleanup
        });
      }
    };
  }, []);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [post.likes, currentUser._id]);

  // Handle screen focus/blur for video playback
  useFocusEffect(
    useCallback(() => {
      // When screen comes into focus
      if (isVideo(imageUrls[0]) && !videoError) {
        setShouldPlay(true);
      }
      
      return () => {
        // When screen loses focus, pause video
        setShouldPlay(false);
        if (videoRef.current) {
          videoRef.current.pauseAsync().catch(() => {});
        }
      };
    }, [imageUrls, videoError])
  );

  // Reset video state when post changes
  useEffect(() => {
    setVideoError(false);
    setIsVideoLoaded(false);
    setShouldPlay(false);
  }, [post._id]);

  const handleVideoLoad = useCallback(() => {
    setIsVideoLoaded(true);
    if (isVideo(imageUrls[0])) {
      setShouldPlay(true);
    }
  }, [imageUrls]);

  const handleVideoError = useCallback(() => {
    console.warn('Video failed to load:', imageUrls[0]);
    setVideoError(true);
    setShouldPlay(false);
  }, [imageUrls]);

  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) {
      // Restart video when it finishes (for looping)
      if (videoRef.current) {
        videoRef.current.replayAsync().catch(() => {});
      }
    }
  }, []);

  const handleLike = (vibrate = false) => {
    if (vibrate) Vibration.vibrate(50);

    if(isLiked){
      setIsLiked(false);
      removeRating();
    } else {
      setIsLiked(true);
      triggerHeartAnimation();
      setShowRatingPopup(true);
    }
  };

  const triggerHeartAnimation = useCallback(() => {
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
  }, [scaleAnim]);

  const handleDoublePress = useDoublePress(() => handleLike(true));

  const handleDeletePost = async () => {
    await deletePost({ postId: post._id });
    setModalOpen(true);
  }

  const handleRating = async (value: number, type: "Post" | "Comment" | "User", targetId: string) => {
    console.log(value, type, targetId);
    if(value === 0) {
      if(!post.likes.includes(currentUser._id)) 
        setIsLiked(false);
      return;
    }
    await createRating({ rating: value, targetType: type, targetId});
  }

  const removeRating = async () => {
    await deleteRating({targetType: "Post", targetId: post._id })
  }

  const handleEditPost = async () => {
    if(!editContent) return;
    await updatePost({ postId: post._id, content: editContent });
    setModalOpen(true);
  }

  const handleAvatarPress = ( userId: string) => {
    setShowCommentsSheet(false);
    navigation.navigate("MainApp", { screen: "Profile", params: { userId }})
  }

  return (
  <>
    <Box className="bg-white dark:bg-card-dark rounded-lg">
      {/* Deleted Post Modal */}
      <MyModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          navigation.navigate("MainApp", { screen: "Profile"});
        }}
        onButtonPress={() => navigation.navigate("MainApp", { screen: "Profile"})}
        title="Success"
        message={`Post was ${editContent ? "edited" : "deleted"} successfully.`}
        buttonText="OK"
      />

      {/* Header: Avatar, Username, Menu */}
      <Box className="flex-row items-center justify-between px-4 py-2">
        <Pressable className="flex-row items-center"
          onPress={() => handleAvatarPress(post.author._id as string)}
        >
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
        </Pressable>

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
            onPress={() => isMyPost ? setPostEdit(true) : console.log("Hide post")} 
            key="Hide post"
            textValue='Hide post'
          >
            <IC_EyeOff className="h-5 w-5"/>
            <MenuItemLabel size="sm">
              {isMyPost ? 
              "Edit Post"
              :
              "Hide Post"
              }
            </MenuItemLabel>
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
            onPress={() => isMyPost ? handleDeletePost() : console.log("Report post")} 
            key="Report post"
            textValue='Report post'
          >
            <IC_Report className="h-5 w-5" color="red"/>
            <MenuItemLabel className="text-red-500" size="sm">
              {isMyPost ? 
              "Delete Post"
              :
              "Report post"
              }
            </MenuItemLabel>
          </MenuItem>
        </Menu>
      </Box>

      {/* Post Image/Video */}
      <Pressable onPress={handleDoublePress}>
        <Box className="relative w-full aspect-square overflow-hidden">
          {isVideo(imageUrls[0]) && !videoError ? (
            <Video
              ref={videoRef}
              key={`post-video-${post._id}-${imageUrls[0]}`}
              source={{ uri: imageUrls[0] }}
              resizeMode={ResizeMode.COVER}
              shouldPlay={shouldPlay}
              isLooping={false} // Handle looping manually for better control
              isMuted={false}
              volume={0.8}
              style={{ 
                width: '100%', 
                height: '100%',
                backgroundColor: '#f0f0f0'
              }}
              onLoad={handleVideoLoad}
              onError={handleVideoError}
              onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
              useNativeControls={false}
              progressUpdateIntervalMillis={1000}
            />
          ) : (
            <Image
              key={`post-image-${post._id}-${imageUrls[0]}`}
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

      {showRatingPopup &&
        <RatingPopup 
          onRate={handleRating}
          targetId={post._id}
          onClose={() => setShowRatingPopup(false)}
          type='Post'
        />
      }

      {/* Actions: Like, Comment, Share, Bookmark */}
      <Box className="flex-row items-center justify-between px-4 py-2">
        <Box className="flex-row gap-3">
          {/* Like */}
          <TouchableIcon
            Icon={IC_Heart}
            className="h-6 w-6" 
            color={isLiked ? "red" : ""}
            onPress={() => {
              handleLike(false);
            }}
          />
          {/* Comment */}
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
        <Text className="text-[15px] font-semibold">
          {likeCount} likes
        </Text>
        <Box className="flex-row mt-1 items-center gap-2">
          <Text className="font-medium ">
            {author.username}
          </Text>
          { !postEdit ?
          <Text className="flex-shrink text-[13px] ">
            {content}
          </Text>
          :
          <Box className='flex-row gap-3 items-center'>
            <TextInput
              placeholder="Write a caption..."
              multiline
              value={editContent || ""}
              onChangeText={setEditContent}
              className="border border-gray-300 rounded-lg text-base w-[70%]"
            />
            <TouchableIcon
              Icon={IC_Vi}
              onPress={() => handleEditPost()}
              IconClassName='h-5 w-5'
              color='#818cf8'
            >
            </TouchableIcon>
          </Box>
          }
          
        </Box>
        <Text className="mt-1 text-[12px] text-gray-500">
          {`Posted ${getTimeAgo(createdAt)}`}
        </Text>
      </Box>
    </Box>
    <PostCommentSheet 
      showActionsheet={showCommentsSheet}
      setShowActionsheet={setShowCommentsSheet} 
      postId={post._id}
      handleAvatarPress={handleAvatarPress}
    />
  </>

  )
}

export default PostCard