import MyLinearGradient from '@/components/gradient/MyLinearGradient'
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar'
import { Box } from '@/components/ui/box'
import{ Text } from '@/components/ui/text'
import { Props } from '@/types/NavigationTypes'
import {IC_AddUsers, IC_Grid, IC_Tag } from '@/utils/constants/Icons'
import { useTheme } from '@/utils/Themes/ThemeProvider'
import { useTranslation } from 'react-i18next'
import CardUpRounded from '@/components/CardUpRounded'
import ProfileTopBar from '@/components/profile/ProfileTopBar'
import { Button, ButtonText } from '@/components/ui/button'
import RatingPopup from '@/components/RatingPopup'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { TouchableOpacity, Dimensions } from 'react-native';
import TouchableIcon from '@/components/TouchableIcon'

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 2;


interface ProfileScreenProps extends Props {}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
	const { appliedTheme } = useTheme()

	const indicatorTranslateX = useSharedValue(0);
	const indicatorStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: indicatorTranslateX.value }],
	}));
	const handleTabPress = (index: number) => {
		indicatorTranslateX.value = withTiming(index * (width / 2), { duration: 300 });
	};


	return (
	<Box className="bg-blue-500 flex-1">
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
								uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
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
		<CardUpRounded className="-mt-5">
			{/* Buttons Line Animation */}
			<Box className="relative">
				<Box className="flex-row gap-2 justify-evenly ">
					<TouchableIcon onPress={() => handleTabPress(0)} Icon={IC_Grid} className="w-8 h-8" />
					<TouchableIcon onPress={() => handleTabPress(1)} Icon={IC_Tag} className="w-8 h-8" />
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



			<Box className="flex-1">

				<Text>HELLO</Text>
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
