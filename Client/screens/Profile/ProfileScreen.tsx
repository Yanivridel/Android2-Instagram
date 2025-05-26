import MyLinearGradient from '@/components/gradient/MyLinearGradient'
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar'
import { Box } from '@/components/ui/box'
import { Divider } from '@/components/ui/divider'
import { Text } from '@/components/ui/text'
import { Props } from '@/types/NavigationTypes'
import {
	IC_AddUsers,
	IC_Bell_V2,
	IC_Budget,
	IC_Card_V2,
	IC_Invite,
	IC_Logout_V2,
	IC_Piggy_Bank,
	IC_Profile_V2,
	IC_Setting,
	IC_Subscription
} from '@/utils/constants/Icons'
import { useTheme } from '@/utils/Themes/ThemeProvider'
import { ScrollView, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import CardUpRounded from '@/components/CardUpRounded'
import ProfileTopBar from '@/components/profile/ProfileTopBar'
import { Button, ButtonText } from '@/components/ui/button'
import RatingPopup from '@/components/RatingPopup'

interface ProfileScreenProps extends Props {}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
	const { t } = useTranslation()
	const { appliedTheme } = useTheme()

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
			<Box className="flex-1">
				<Text>HELLO</Text>
			</Box>
		</CardUpRounded>

		<RatingPopup 
			onRate={(data) => console.log('Rating:', data)}
			onClose={() => {}}
			type="post"
			targetId="123"
		/>

	</Box>
	)
}
