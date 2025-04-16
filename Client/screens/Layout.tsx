import { Box } from '@/components/ui/box'
import { Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
	NavigationProp,
	ParamListBase,
	useNavigationState
} from '@react-navigation/native'
import React from 'react'
import { useTheme } from '@/utils/Themes/ThemeProvider'
import {
	IC_Home,
	IC_Invest,
	IC_Market,
	IC_Portfolio,
	IC_Profile,
	IC_Tothor_Logo_Only_Bold
} from '@/utils/constants/Icons'
import { useTranslation } from 'react-i18next'

interface LayoutProps {
	children: React.ReactNode
	navigation: NavigationProp<ParamListBase>
}

const Layout = React.memo(({ children, navigation }: LayoutProps) => {
	const { appliedTheme } = useTheme()
	const { t } = useTranslation()

	const currentScreen = useNavigationState(state => {
		const mainAppRoute = state.routes.find(route => route.name === 'MainApp')
		if (mainAppRoute && mainAppRoute.state) {
			return mainAppRoute.state.routes[mainAppRoute.state.index || 0].name || 'Home'
		}
		return 'Home'
	})

	function navigateToScreen(screen: string) {
		navigation.navigate('MainApp', { screen })
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			{/* Main Rendered Screens */}
			<Box style={{ flex: 1 }}>{children}</Box>

			{/* Bottom Navigation Bar */}
			<Box className="relative">
				<Box className={`flex flex-row items-center h-[62px] bg-layoutBottom-${appliedTheme} p-4`}>
					{/* Left Icons */}
					<Box className="flex-1 flex flex-row justify-evenly">
						<TouchableOpacity onPress={() => navigateToScreen('Home')}>
							<Box className="flex-col items-center text-center">
								<IC_Home
									className="w-7 h-7 mb-1"
									color={currentScreen === 'Home' ? '#4A3EF6' : '#B0B9C1'}
								/>
								<Text
									className={`text-sm ${
										currentScreen === 'Home'
											? 'text-[#1761C5]'
											: 'text-[#5C616F]'
									}`}
								>
									{t('layout.tabs.home')}
								</Text>
							</Box>
						</TouchableOpacity>

						<TouchableOpacity onPress={() => navigateToScreen('Markets')}>
							<Box className="flex-col items-center text-center">
								<IC_Market
									className="w-7 h-7 mb-1"
									color={currentScreen === 'Markets' ? '#4A3EF6' : '#B0B9C1'}
								/>
								<Text
									className={`text-sm ${
										currentScreen === 'Markets'
											? 'text-[#1761C5]'
											: 'text-[#5C616F]'
									}`}
								>
									{t('layout.tabs.markets')}
								</Text>
							</Box>
						</TouchableOpacity>
					</Box>

					{/* Center Button */}
					<Box className="w-20 relative">
						<TouchableOpacity onPress={() => navigateToScreen('Tothor')}>
							<Box
								className={`bg-button-${appliedTheme} bottom-[18px] rounded-full w-16 h-16 items-center self-center justify-center`}
							>
								<IC_Tothor_Logo_Only_Bold className="w-10 h-10" />
							</Box>
							<Text
								className={`text-sm bottom-4 justify-center text-center ${
									currentScreen === 'Tothor'
										? 'text-[#1761C5]'
										: 'text-[#5C616F]'
								}`}
							>
								{t('layout.tabs.tothor')}
							</Text>
						</TouchableOpacity>
					</Box>

					{/* Right Icons */}
					<Box className="flex-1 flex flex-row justify-evenly">
						<TouchableOpacity onPress={() => navigateToScreen('Investment')}>
							<Box className="flex-col items-center text-center">
								<IC_Invest
									className="w-8 h-8"
									color={currentScreen === 'Investment' ? '#4A3EF6' : '#B0B9C1'}
								/>
								<Text
									className={`text-sm ${
										currentScreen === 'Investment'
											? 'text-[#1761C5]'
											: 'text-[#5C616F]'
									}`}
								>
									{t('layout.tabs.investment')}
								</Text>
							</Box>
						</TouchableOpacity>

						<TouchableOpacity onPress={() => navigateToScreen('Profile')}>
							<Box className="flex-col items-center text-center">
								<IC_Profile
									className="w-8 h-8"
									color={currentScreen === 'Profile' ? '#4A3EF6' : '#B0B9C1'}
								/>
								<Text
									className={`text-sm ${
										currentScreen === 'Profile'
											? 'text-[#1761C5]'
											: 'text-[#5C616F]'
									}`}
								>
									{t('layout.tabs.profile')}
								</Text>
							</Box>
						</TouchableOpacity>
					</Box>
				</Box>
			</Box>
		</SafeAreaView>
	)
})

export default Layout
