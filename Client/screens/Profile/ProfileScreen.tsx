import MyLinearGradient from '@/components/gradient/MyLinearGradient'
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar'
import { Box } from '@/components/ui/box'
import { Divider } from '@/components/ui/divider'
import { Text } from '@/components/ui/text'
import { Props } from '@/types/NavigationTypes'
import {
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

interface ProfileScreenProps extends Props {}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
	const { t } = useTranslation()
	const { appliedTheme } = useTheme()

	const thingToDo = [
		{
			icon: IC_Card_V2,
			header: t('profile.todo.idStep1Title'),
			description: t('profile.todo.idStepDescription'),
			actionText: t('profile.todo.verifyNow'),
			actionFunction: () => navigation.navigate('VerifyIdentity')
		},
		{
			icon: IC_Profile_V2,
			header: t('profile.todo.idStep2Title'),
			description: t('profile.todo.idStepDescription'),
			actionText: t('profile.todo.verifyNow'),
			actionFunction: () => {}
		},
		{
			icon: IC_Bell_V2,
			header: t('profile.todo.idStep3Title'),
			description: t('profile.todo.idStepDescription'),
			actionText: t('profile.todo.verifyNow'),
			actionFunction: () => {}
		}
	]

	return (
	<Box className="bg-blue-500 flex-1">
		{/* Profile Header */}
		<MyLinearGradient
			type="background"
			color={appliedTheme === 'dark' ? 'blue' : 'purple'}
			className="h-[48%]"
		>
			<Box className="justify-center items-center gap-2 p-2">
			<ProfileTopBar />
			<Avatar className="bg-indigo-600 border-[2.5px] border-indigo-400">
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
			</Box>
		</MyLinearGradient>

		{/* Profile Body */}
		<CardUpRounded>
			<Box className="flex-1">
				<Text>HELLO</Text>
			</Box>
		</CardUpRounded>

	</Box>
	)
}
