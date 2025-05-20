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
      avatar: 'https://placekitten.com/50/50'
    },
    image: 'https://placekitten.com/400/400',
    caption: 'Enjoying the sunshine! #catlife',
    likes: 128,
    timestamp: '2h ago'
  },
  {
    id: '2',
    user: {
      name: 'jane_smith',
      avatar: 'https://placekitten.com/51/51'
    },
    image: 'https://placekitten.com/401/401',
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

const HomeScreen = () => {
  const { appliedTheme } = useTheme()

  return (
    <ScrollView className={`flex-1 bg-background-${appliedTheme}`}>
      {/* Header */}
      <Box className={`flex-row items-center justify-between px-4 py-2 bg-card-${appliedTheme}`}>
        <TouchableOpacity>
          <Image
            source={require('@/assets/favicon.png')}
            className="h-6 w-6"
          />
        </TouchableOpacity>

        <Image
          source={require('@/assets/favicon.png')}
          className="h-8 w-24"
          resizeMode="contain"
        />

        <TouchableOpacity>
          <Image
            source={require('@/assets/favicon.png')}
            className="h-6 w-6"
          />
        </TouchableOpacity>
      </Box>

      {/* Stories Section (optional) */}
      {/* You can add a horizontal FlashList of story circles here */}

      <Divider className={`bg-divider-${appliedTheme}`} />

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
    </ScrollView>
  )
}

export default HomeScreen
