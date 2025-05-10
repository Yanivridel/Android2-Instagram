import BackHeader from '@/components/BackHeader'
import MyLinearGradient from '@/components/gradient/MyLinearGradient'
import SettingItem from '@/components/SettingItems'
import ThingToDo from '@/components/ThingToDo'
import TothorCards from '@/components/TothorCards'
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
		<ScrollView>
			<Box className="h-full">
				<MyLinearGradient
					type="background"
					color={appliedTheme === 'dark' ? 'blue' : 'purple'}
					className="h-[48%]"
				>
					<BackHeader title={t('profile.header')} colorScheme="alwaysWhite" />
					<Box className="justify-center items-center gap-2 p-2">
						<Avatar size="xl">
							<AvatarFallbackText>{"Yaniv"}</AvatarFallbackText>
							<AvatarImage source={{ uri: "Yaniv.png" }} />
						</Avatar>
						<Text className={`text-[24px] font-bold text-white`}>
							{"Yaniv"}
						</Text>
						<Text className={`text-[14px] text-white`}>{"Yaniv@gmail"}</Text>
						<Box className="z-10">
							<ThingToDo thingToDo={thingToDo} />
						</Box>
					</Box>
				</MyLinearGradient>

				<MyLinearGradient
					type="background"
					color={appliedTheme === 'dark' ? 'dark' : 'light-blue'}
					className="h-full"
				>
					<Box className="gap-4 p-4 justify-center">
						<Box className="" />

						<TothorCards>
							<SettingItem
								title={t('profile.settings.savingGoals')}
								IconComponent={IC_Piggy_Bank}
								badge={t('profile.settings.start')}
							/>
							<Divider />

							<SettingItem
								title={t('profile.settings.budgets')}
								IconComponent={IC_Budget}
							/>
							<Divider />

							<SettingItem
								title={t('profile.settings.bundles')}
								IconComponent={IC_Subscription}
							/>
						</TothorCards>

						{/* Setting + Invite */}
						<TothorCards>
							<SettingItem
								title={t('profile.settings.invite')}
								IconComponent={IC_Invite}
								badge={t('profile.settings.earn')}
							/>
							<Divider />
							<TouchableOpacity
								onPress={() =>
									navigation.navigate('Settings', { screen: 'Settings' })
								}
							>
								<SettingItem
									title={t('profile.settings.settings')}
									IconComponent={IC_Setting}
								/>
							</TouchableOpacity>
						</TothorCards>

						<TothorCards>
							<SettingItem
								title={t('profile.settings.logout')}
								IconComponent={IC_Logout_V2}
							/>
						</TothorCards>
					</Box>
				</MyLinearGradient>
			</Box>
		</ScrollView>
	)
}
