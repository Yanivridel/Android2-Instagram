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
import { useState } from 'react'

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
	const [currentTab, setCurrentTab] = useState<'grid' | 'tag'>('grid');

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
							{"Yaniv"}
						</AvatarFallbackText>
						<AvatarImage
							source={{
								uri: "data:image/jpeg;base64,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",
							}}
							alt="User Avatar"
						/>
					</Avatar>

					<Box className="flex-row gap-5 p-4">
						<Box className="items-center">
							<Text className="text-white text-2xl font-bold">0</Text>
							<Text className="text-white text-sm">Posts</Text>
						</Box>
						<Box className="items-center">
							<Text className="text-white text-2xl font-bold">0</Text>
							<Text className="text-white text-sm">Followers</Text>
						</Box>
						<Box className="items-center">
							<Text className="text-white text-2xl font-bold">0</Text>
							<Text className="text-white text-sm">Following</Text>
						</Box>
					</Box>
				</Box>
				{/* Name & Bio */}
				<Box>
					<Box className='flex-row gap-2 items-center'>
						<Text className="text-white font-bold">Yaniv Ridel</Text>
						<Text className="text-gray-300 text-sm">he/him</Text>
					</Box>
					<Text className="text-white text-[13px] leading-5">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
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
		<CardUpRounded className="-mt-5 px-0">
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

			<Box className="flex-1 mt-1">
				{currentTab === 'grid' && (
					<PostsGrid posts={dummyMyPosts} onPostPress={() => {}} />
				)}
				{currentTab === 'tag' && (
					<PostsGrid posts={dummyMyTags} onPostPress={() => {}} />
				)}
			</Box>
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
