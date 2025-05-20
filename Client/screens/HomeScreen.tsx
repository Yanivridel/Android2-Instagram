import React from 'react'
import { ScrollView, TouchableOpacity, Image } from 'react-native'
import { Box } from '@/components/ui/box'
import { Divider } from '@/components/ui/divider'
import { FlashList } from '@shopify/flash-list'
import { useTheme } from '@/utils/Themes/ThemeProvider'

// Dummy data for posts
const dummyPosts: Post[] = [
  {
    id: '1',
    user: {
      name: 'john_doe',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'
    },
    image: 'https://images.unsplash.com/photo-1611003228941-98852ba62227?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFieSUyMGRvZ3xlbnwwfHwwfHx8MA%3D%3D',
    caption: 'Enjoying the sunshine! #catlife',
    likes: 128,
    timestamp: '2h ago'
  },
  {
    id: '2',
    user: {
      name: 'jane_smith',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80'
    },
    image: 'https://t4.ftcdn.net/jpg/01/04/78/75/360_F_104787586_63vz1PkylLEfSfZ08dqTnqJqlqdq0eXx.jpg',
    caption: 'Delicious brunch with friends',
    likes: 256,
    timestamp: '4h ago'
  },
  // ... more dummy posts
]

// Placeholder PostCard component should exist in your components directory
// It handles layout of avatar, username, image, actions, caption, etc.
import PostCard from '@/components/home/PostCard'
import { Post } from '@/types/postTypes'
import { IC_Heart, IC_Messenger } from '@/utils/constants/Icons'
import MyLinearGradient from '@/components/gradient/MyLinearGradient'
import { Props } from '@/types/NavigationTypes'

const HomeScreen = ({ navigation }: Props) => {
  const { appliedTheme } = useTheme()
  
  
  return (
  <>
    {/* Header */}
    <MyLinearGradient type="background" color="light-blue">
      <Box className={`flex-row items-center justify-between px-4 py-2 bg-card-${appliedTheme}`}>
        <TouchableOpacity
          onPress={() => navigation.navigate("MainApp", { screen: "Notifications" })}
        >
          <IC_Heart className="h-6 w-6" color="" />
        </TouchableOpacity>

        <Image
          source={require('@/assets/images/violet_long_logo.png')}
          className="h-[35px] w-[80px]"
          resizeMode="contain"
          alt="Logo"
        />

        <TouchableOpacity>
          <IC_Messenger className="h-6 w-6" color="black" />
        </TouchableOpacity>
      </Box>
    </MyLinearGradient>
    <Box className={`flex-1 bg-background-${appliedTheme}`}>

      {/* Stories Section (optional) */}
      {/* You can add a horizontal FlashList of story circles here */}

      {/* Posts Feed */}
      <FlashList
        data={dummyPosts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Box className="mb-4">
            <PostCard post={item} />
          </Box>
        )}
        estimatedItemSize={500}
        showsVerticalScrollIndicator={false}
      />
    </Box>
    </>
  )
}

export default HomeScreen
