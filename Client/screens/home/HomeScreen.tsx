import React, { useEffect, useState } from 'react'
import { Image, RefreshControl } from 'react-native'
import { Box } from '@/components/ui/box'
import { FlashList } from '@shopify/flash-list'
import { useTheme } from '@/utils/Themes/ThemeProvider'

// Placeholder PostCard component should exist in your components directory
// It handles layout of avatar, username, image, actions, caption, etc.
import PostCard from '@/components/home/PostCard'
import { IPost } from '@/types/postTypes'
import { IC_Heart, IC_Messenger } from '@/utils/constants/Icons'
import MyLinearGradient from '@/components/gradient/MyLinearGradient'
import { Props } from '@/types/NavigationTypes'
import TouchableIcon from '@/components/TouchableIcon'
import { getAllPostsRandomized, getPostById } from '@/utils/api/internal/postApi'
import SpinnerLoader from '@/components/SpinnerLoader'
import { Text } from '@/components/ui/text'

interface HomeRouteType {
  params: {
      postId: string | null;
  };
}

const HomeScreen = ({ navigation, route }: Props) => {
  const { postId } = (route as HomeRouteType).params || { postId: null };
  const { appliedTheme } = useTheme()
  const [refreshing, setRefreshing] = useState(false);  
  const [allPosts, setAllPosts] = useState<IPost[] | null>(null);
  const [singlePost, setSinglePost] = useState<IPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleGetPosts = async () => {
    getAllPostsRandomized()
      .then(posts => {
        setAllPosts(posts);
        setIsLoading(false);
      })
  }
  
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await handleGetPosts();
    } catch(err) {
      console.log("Failed to refresh");
    }
    finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if(postId){
      getPostById({ postId })
      .then(post => {
        setSinglePost(post);
        setIsLoading(false);
      })
    }
    else {
      handleGetPosts();
    }
  }, [ postId ]);
  
  return (
  <Box className="flex-1">
    {/* Header */}
    <MyLinearGradient type="background" color="light-blue">
      <Box className={`flex-row items-center justify-between px-4 py-2 bg-card-${appliedTheme}`}>
        <TouchableIcon 
          Icon={IC_Heart} 
          className="h-6 w-6" 
          color="" 
          onPress={() => navigation.navigate("MainApp", { screen: "Notifications" })}
          />

        <Image
          source={require('@/assets/images/violet_long_logo.png')}
          className="h-[35px] w-[80px]"
          resizeMode="contain"
          alt="Logo"
        />

          <TouchableIcon 
            Icon={IC_Messenger} 
            className="h-6 w-6" 
            color="black" 
            onPress={() => navigation.navigate("MainApp", { screen: "Chat" })}
            />
      </Box>
    </MyLinearGradient>
    {/* Main Content */}
    <Box className={`flex-1 bg-background-${appliedTheme}`}>

      {/* Stories Section (optional) */}
      {/* You can add a horizontal FlashList of story circles here */}

      {/* Posts Feed */}
      { isLoading ? 
        <SpinnerLoader className='mt-5'/>
      :
      <>
      { postId ?
        <>
          { singlePost ?
            <Box className="mb-4">
              <PostCard key={`single-${singlePost._id}`} post={singlePost} />
            </Box>
          :
            <Text className='p-4 color-indigo-600 mx-auto mt-5'>Post Not Found, Please try again later...</Text>
        }
        </>
        :
        <FlashList
          data={allPosts}
          keyExtractor={item =>`feed-${item._id}`}
          renderItem={({ item }) => (
            <Box className="mb-4">
              <PostCard post={item} />
            </Box>
          )}
          estimatedItemSize={500}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl colors={['#4f46e5', '#db2777']} refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      }
        </>
      }
      
    </Box>
  </Box>
  )
}

export default HomeScreen
