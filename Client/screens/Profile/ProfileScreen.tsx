import MyLinearGradient from '@/components/gradient/MyLinearGradient'
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar'
import { Box } from '@/components/ui/box'
import{ Text } from '@/components/ui/text'
import { Props } from '@/types/NavigationTypes'
import {IC_AddUsers, IC_Grid, IC_Tag } from '@/utils/constants/Icons'
import { useTheme } from '@/utils/Themes/ThemeProvider'
import CardUpRounded from '@/components/CardUpRounded'
import ProfileTopBar from '@/components/profile/ProfileTopBar'
import { Button, ButtonText } from '@/components/ui/button'
import RatingPopup from '@/components/RatingPopup'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import TouchableIcon from '@/components/TouchableIcon'
import { PostsGrid } from '@/components/post/PostsGrid'
import { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { RootState } from '@/store'
import { IUser } from '@/types/userTypes'
import { getAllMyPosts } from '@/utils/api/internal/postApi'
import { IPost } from '@/types/postTypes'
import SpinnerLoader from '@/components/SpinnerLoader'


const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 2;

const dummyMyPosts = Array.from({ length: 12 }).map((_, i) => ({
	id: `${i + 1}`,
	imageUrl: `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIALcAwwMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAUBAwYCB//EADEQAQACAQIDBwIDCQAAAAAAAAABAgMEESExUQUSIjJBYXEjUhMUwRUzYoGRoaKx0f/EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/xAAWEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/APoIDo5gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9232z/QGAAAAAAAAAAAAAAAAAAAAASdHpLam2/lxxzt/wABqw4cme/dx13n/SywdmY67Tmnvz0jhCZixUw0imOu1Ye2dakeaY6Y42x0rX4jZ73YEV4yYseSPqUrb5hEzdmYr7zimaT05wnAKDUaXNp/PXw/dHGGl0s8Y2nkr9X2bW299P4bfZ6T8NSs2KoZtE0tNbRMTHOJFRgAAABmtbXtFaxMzPpEMLzQaeuHBWdvHaN7T+iWrIq/yOp23/Bnb5homJrMxaJiY5xLpEPtPT1yYZyxHjpG+/WDVxTAKyAAA94cVs2WuOnOf7A26PTW1OTblSPNK8pSuOkUpG1Y5Q84MVcGKMdOUevV7ZtakAEUAAAAAA2iecQwyA5oBtgAAdDp7xkwUvXlNXPJGk1l9NO0R3qTzrKWLKvWjXXimkyzPrXux/NG/auPb91ffpwQdVqsmptE34VjlWPRJFtaAGmQABd9n6b8vi3tH1Lc/b2Q+y9N37/jXjw1nw+8rZm1qQARQAAAAAAAAAFVbsrJHky1n5jZFzaXPh43xzt1jjC/F1Mc0LvUaDDm3msdy/WsfoqtRpsunttkrw9LRyldTGkBUAAAAG3TYbZ80Y6+vOekNS80Gm/L4vFH1Lcbe3slqyJFKVx0ilI2rEbQyDLQAAAAAAAAAAAAAAxatb1mt4iazziWQFRrOz7Yt74d7U9Y9YQXSq/XaCL75MEbW9a9fhZUsVQTG07TwkaZAS9Bo51Fu/eNsUf5ewN3Zel70xnyRwjyR191oREREREbRHKBhuAAAAAAAAAAAAAAAAAAAAIur0VNR4qz3MnXr8oE9m6iJ2iKz7xZci6mK7T9mRExbPaLfw15LGIiIiIiIiOUQCKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//Z`,
}));
const dummyMyTags = Array.from({ length: 12 }).map((_, i) => ({
	id: `${i + 1}`,
	imageUrl: `data:image/png;base64,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`,
}));


const TAB_INDEX = {
	grid: 0,
	tag: 1,
}

interface ProfileScreenProps extends Props {}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
	const { appliedTheme } = useTheme()
	const currentUser = useSelector(
		(state: RootState) => state.currentUser
	) as unknown as IUser;
	const [currentTab, setCurrentTab] = useState<'grid' | 'tag'>('grid');
	const [ myPosts, setMyPosts ] = useState<IPost[] | null>(null);
	const [ isLoadingMyPosts, setIsLoadingMyPosts ] = useState(true);

	useEffect(() => {
		getAllMyPosts()
		.then(posts => {
			// console.log("posts", posts);
			setMyPosts(posts);
			setIsLoadingMyPosts(false);
		})

	}, []);

	const indicatorTranslateX = useSharedValue(0);
	const indicatorStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: indicatorTranslateX.value }],
	}));
	const handleTabPress = (tab: 'grid' | 'tag') => {
		setCurrentTab(tab);
		indicatorTranslateX.value = withTiming(TAB_INDEX[tab] * TAB_WIDTH, { duration: 300 });
	};

	return (
	<Box className="flex-1">
		{/* Profile Header */}
		<MyLinearGradient
			type="background"
			color={appliedTheme === 'dark' ? 'blue' : 'purple'}
			className=""
		>
			<ProfileTopBar />
			<Box className="gap-2 p-4">
				{/* avatar & name */}
				<Box className="flex-row w-full justify-between items-center">
					<Avatar className="bg-indigo-600 border-[2.5px] border-indigo-400 w-[30%] aspect-square">
						<AvatarFallbackText className="text-white">
							{currentUser.username}
						</AvatarFallbackText>
						<AvatarImage
							source={{
								uri: currentUser.profileImage,
							}}
							alt="User Avatar"
						/>
					</Avatar>

					{/* Statistics */}
					<Box className="flex-row flex-1 justify-evenly p-4">
						<Box className="items-center">
							<Text className="text-white text-2xl font-bold">0</Text>
							<Text className="text-white text-sm">Posts</Text>
						</Box>
						<Box className="items-center">
							<Text className="text-white text-2xl font-bold">{currentUser.ratingStats.averageScore}</Text>
							<Text className="text-white text-sm">Rating</Text>
						</Box>
						<Box className="items-center">
							<Text className="text-white text-2xl font-bold">0</Text>
							<Text className="text-white text-sm">Friends</Text>
						</Box>
					</Box>
				</Box>
				{/* Name & Bio */}
				<Box>
					<Box className='flex-row gap-2 items-center'>
						<Text className="text-white font-bold">{currentUser.username}</Text>
						<Text className="text-gray-300 text-sm">{currentUser.gender}</Text>
					</Box>
					<Text className="text-white text-[13px] leading-5">
						{currentUser.bio}
					</Text>

				</Box>

				{/* Buttons */}
				<Box className="flex-row gap-2 px-1">
					<MyLinearGradient type='button' color='light-blue' className='flex-1'>
						<Button className="h-fit">
							<ButtonText className="text-black">Edit Profile</ButtonText>
						</Button>
					</MyLinearGradient>
					<MyLinearGradient type='button' color='light-blue' className='w-[70px]'>
						<Button className="h-fit flex-1">
							<IC_AddUsers className="w-5 h-5" color="black"/>
						</Button>
					</MyLinearGradient>
				</Box>

				{/* Space for CardUpRounded */}
				<Box className="pb-2"/> 
			</Box>
		</MyLinearGradient>

		{/* Profile Body */}
		<CardUpRounded className="-mt-5 px-0 pb-0">
			{/* Buttons Line Animation */}
			<Box className="relative">
				<Box className="flex-row gap-2 justify-evenly mb-2">
					<TouchableIcon className="flex-1 justify-center items-center" onPress={() => handleTabPress('grid')} Icon={IC_Grid} IconClassName="w-8 h-8" />
					<TouchableIcon className="flex-1 justify-center items-center" onPress={() => handleTabPress('tag')} Icon={IC_Tag} IconClassName="w-8 h-8" />
				</Box>

				<Animated.View
					className=""
					style={[
					indicatorStyle,
					{
						width: TAB_WIDTH,
						height: 2,
						backgroundColor: 'black',
						position: 'absolute',
						bottom: 0,
						left: 0,
					},
					]}
				/>
			</Box>
			{/* Posts Grid */}
			{isLoadingMyPosts ? (
				<SpinnerLoader className='mt-16'/>
				) : myPosts?.length ? (
				<Box className="flex-1 mt-1">
					{currentTab === 'grid' && (
						<PostsGrid posts={myPosts} onPostPress={() => {}} />
					)}
					{currentTab === 'tag' && (
						<Box className='justify-center items-center mt-10'>
							<Text className='p-4 color-indigo-600'>No one tagged you in a post yet</Text>
						</Box>
					)}
				</Box>
				) : (
				<Box className='justify-center items-center mt-10'>
					<Text className='p-4 color-indigo-600'>No Posts Found</Text>
				</Box>
			)}
		</CardUpRounded>

		{/* <RatingPopup 
			onRate={(data) => console.log('Rating:', data)}
			onClose={() => {}}
			type="post"
			targetId="123"
		/> */}

	</Box>
	)
}
