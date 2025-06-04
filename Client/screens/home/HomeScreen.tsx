import React, { useState } from 'react'
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

// Dummy data for posts
const dummyPosts: IPost[] = [
  {
    _id: '1',
    content: 'Enjoying the sunshine! #catlife',
    imageUrls: [
      'https://images.unsplash.com/photo-1611003228941-98852ba62227?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      _id: 'u1',
      firebaseUid: 'firebase-uid-john',
      username: 'john_doe',
      email: 'john@example.com',
      role: 'user',
      rating: 4.7,
      bio: 'Cat lover and sunshine addict.',
      gender: 'male',
      profileImage:
        'https://res.cloudinary.com/dgn7wbfhw/image/upload/v1748545167/fi5sj6nyc5fcoi6bppxk.jpg',
      posts: [],
      likedPosts: [],
      likedComments: [],
      followers: [],
      following: [],
      groups: [],
      taggedPosts: [],
      notifications: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    },
    group: undefined,
    isPublic: true,
    rating: 0,
    comments: {
      content: 'So cute!',
      post: '1',
      author: {
        _id: 'u2',
        firebaseUid: 'firebase-uid-commenter',
        username: 'cat_lover_22',
        email: 'catlover@example.com',
        role: 'user',
        rating: 4.5,
        bio: 'Professional cat cuddler',
        gender: 'female',
        profileImage:
          'https://randomuser.me/api/portraits/women/44.jpg',
        posts: [],
        likedPosts: [],
        likedComments: [],
        followers: [],
        following: [],
        groups: [],
        taggedPosts: [],
        notifications: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 3,
    },
    likes: 128,
    locationString: 'Tel Aviv, Israel',
  },
  {
    _id: '2',
    content: 'Delicious brunch with friends',
    imageUrls: [
      'https://t4.ftcdn.net/jpg/01/04/78/75/360_F_104787586_63vz1PkylLEfSfZ08dqTnqJqlqdq0eXx.jpg',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      _id: 'u2',
      firebaseUid: 'firebase-uid-jane',
      username: 'jane_smith',
      email: 'jane@example.com',
      role: 'user',
      rating: 4.9,
      bio: 'Food enthusiast and traveler',
      gender: 'female',
      profileImage:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1',
      posts: [],
      likedPosts: [],
      likedComments: [],
      followers: [],
      following: [],
      groups: [],
      taggedPosts: [],
      notifications: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    },
    group: undefined,
    isPublic: true,
    rating: 0,
    comments: {
      content: 'Looks amazing!',
      post: '2',
      author: {
        _id: 'u3',
        firebaseUid: 'firebase-uid-commenter-2',
        username: 'brunch_addict',
        email: 'brunch@example.com',
        role: 'user',
        rating: 4.6,
        bio: 'Always eating, always posting',
        gender: 'female',
        profileImage:
          'https://randomuser.me/api/portraits/women/65.jpg',
        posts: [],
        likedPosts: [],
        likedComments: [],
        followers: [],
        following: [],
        groups: [],
        taggedPosts: [],
        notifications: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 5,
    },
    likes: 256,
    locationString: 'New York City, USA',
  },
];

const HomeScreen = ({ navigation }: Props) => {
  const { appliedTheme } = useTheme()
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  
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
      <FlashList
        data={dummyPosts}
        keyExtractor={item => item._id}
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
    </Box>
  </Box>
  )
}

export default HomeScreen
