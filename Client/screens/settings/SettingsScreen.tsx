import React, { useState } from 'react'
import { Box } from '@/components/ui/box'
import { Divider } from '@/components/ui/divider'
import SettingItem from '../../components/SettingItems'
import {
	IC_Bell_V2,
	IC_Card_V2,
	IC_CurrentLocation,
	IC_FaceID_V2,
	IC_Help_V2,
	IC_Logout_V2,
	IC_Password_V2,
	IC_PIN_V2,
	IC_Privacy_V2,
	IC_Profile_V2,
	IC_Terms_V2,
	IC_ThemeSettings
} from '@/utils/constants/Icons'
import { Props } from '@/types/NavigationTypes'
import { ScrollView, TouchableOpacity } from 'react-native'

import BackHeader from '@/components/BackHeader'
import MyLinearGradient from '@/components/gradient/MyLinearGradient'
import { Text } from '@/components/ui/text'
import PurpleSwitch from '@/components/PurpleSwitch'
import CardUpRounded from '@/components/CardUpRounded'
import { useTheme } from '@/utils/Themes/ThemeProvider'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
	const { appliedTheme, setTheme } = useTheme()
	const [isFaceIDEnabled, setIsFaceIDEnabled] = useState(false)

	const { t, i18n } = useTranslation()
	const [language, setLanguage] = useState(i18n.language)

	const changeLanguage = async () => {
		const newLang = language === 'en' ? 'fr' : 'en'
		await AsyncStorage.setItem('language', newLang)
		i18n.changeLanguage(newLang)
		setLanguage(newLang)
	}

	return (
		<Box className="h-full">
			<MyLinearGradient
				type="background"
				color={appliedTheme === 'dark' ? 'blue' : 'purple'}
				className="h-[25%]"
			>
				<BackHeader colorScheme="alwaysWhite" />
				<Box className="h-[45%] justify-end p-4">
					<Text className="text-[24px] font-bold text-white">
						{t('settings.title')}
					</Text>
				</Box>
			</MyLinearGradient>

			<CardUpRounded className="p-0">
				<ScrollView bounces={false}>
					{/* Personal Settings */}
					<Box className={`flex gap-2 z-10 mb-2 w-full rounded-t-3xl p-4`}>
						<Text className={`text-text-${appliedTheme} text-[18px] font-bold`}>
							{t('settings.sections.personal')}
						</Text>

						<TouchableOpacity onPress={() => setTheme(appliedTheme === 'dark' ? 'light' : 'dark')}>
							<SettingItem
								title={t('settings.toggle_theme')}
								IconComponent={IC_ThemeSettings}
								badge={appliedTheme}
							/>
						</TouchableOpacity>
						<Divider />

						<TouchableOpacity onPress={changeLanguage}>
							<SettingItem
								title={t('settings.change_language')}
								IconComponent={IC_CurrentLocation}
							/>
						</TouchableOpacity>
						<Divider />

						<SettingItem title={t('settings.personal_info')} IconComponent={IC_Profile_V2} />
						<Divider />

						<TouchableOpacity onPress={() => navigation.navigate('PaymentMethod')}>
							<SettingItem title={t('settings.bank_cards')} IconComponent={IC_Card_V2} />
						</TouchableOpacity>
						<Divider />

						<SettingItem title={t('settings.notifications')} IconComponent={IC_Bell_V2} />
					</Box>

					{/* Security Section */}
					<Box className={`flex gap-2 my-2 w-full p-4`}>
						<Text className={`text-text-${appliedTheme} text-[18px] font-bold`}>
							{t('settings.sections.security')}
						</Text>

						<Box className="flex flex-row items-center">
							<Box className="flex-1 flex-row items-center gap-3">
								<Box className="rounded-full p-2">
									<IC_FaceID_V2 className="h-12 w-12" />
								</Box>
								<Text className={`text-text-${appliedTheme} text-[17px] font-medium`}>
									{t('settings.use_faceid')}
								</Text>
							</Box>
							<PurpleSwitch
								value={isFaceIDEnabled}
								onValueChange={value => setIsFaceIDEnabled(value)}
							/>
						</Box>
						<Divider />

						<SettingItem title={t('settings.change_password')} IconComponent={IC_Password_V2} />
						<Divider />

						<TouchableOpacity onPress={() => navigation.navigate('PinSettings')}>
							<SettingItem title={t('settings.pin_settings')} IconComponent={IC_PIN_V2} />
						</TouchableOpacity>
					</Box>

					{/* Support */}
					<Box className={`flex gap-2 my-2 w-full p-4`}>
						<Text className={`text-text-${appliedTheme} text-[18px] font-bold`}>
							{t('settings.sections.support')}
						</Text>
						<SettingItem title={t('settings.terms')} IconComponent={IC_Terms_V2} />
						<Divider />

						<SettingItem title={t('settings.privacy')} IconComponent={IC_Privacy_V2} />
						<Divider />

						<SettingItem title={t('settings.help')} IconComponent={IC_Help_V2} />
					</Box>

					{/* Logout */}
					<Box className={`flex gap-2 mt-2 w-full p-4`}>
						<Box className="flex flex-row items-center">
							<Box className="flex-1 flex-row items-center gap-3">
								<Box className="rounded-full p-2">
									<IC_Logout_V2 className="h-12 w-12" />
								</Box>
								<Text className={`text-text-${appliedTheme} text-[17px] font-medium`}>
									{t('settings.logout')}
								</Text>
							</Box>
						</Box>
					</Box>
				</ScrollView>
			</CardUpRounded>
		</Box>
	)
}

export default SettingsScreen
