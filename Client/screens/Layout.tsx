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
	IC_AddPost,
	IC_Home,
	IC_Leaderboard,
	IC_Profile,
	IC_Reels,
	IC_Search,
} from '@/utils/constants/Icons'

interface LayoutProps {
	children: React.ReactNode
	navigation: NavigationProp<ParamListBase>
}

const Layout = React.memo(({ children, navigation }: LayoutProps) => {
	const { appliedTheme } = useTheme()

	const currentScreen = useNavigationState(state => {
		const mainAppRoute = state.routes.find(route => route.name === 'MainApp')
		if (mainAppRoute && mainAppRoute.state) {
			return mainAppRoute.state.routes[mainAppRoute.state.index || 0].name || 'Home'
		}
		return 'Home'
	})

	function navigateToScreen(screen: string) {
		if (screen === 'Camera') {
			navigation.navigate('Camera')
		} else {
			navigation.navigate('MainApp', { screen })
		}
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			{/* Main Rendered Screens */}
			<Box style={{ flex: 1 }}>{children}</Box>

			{/* Bottom Navigation Bar */}
			<Box className="relative">
				<Box className={`flex flex-row items-center h-[50px] bg-layoutBottom-${appliedTheme} p-4`}>
					{/* Left Icons */}
					<Box className="flex-1 flex flex-row justify-around">
						<TouchableOpacity onPress={() => navigateToScreen('Home')} activeOpacity={0.7}>
							<Box className="flex-col items-center text-center">
								<IC_Home
									className="w-7 h-7 mb-1"
									color={currentScreen === 'Home' ? '#00877D' : '#B0B9C1'}
								/>
							</Box>
						</TouchableOpacity>

						<TouchableOpacity onPress={() => navigateToScreen('Explore')} activeOpacity={0.7}>
							<Box className="flex-col items-center text-center">
								<IC_Search
									className="w-7 h-7 mb-1"
									color={currentScreen === 'Explore' ? '#00877D' : '#B0B9C1'}
								/>
							</Box>
						</TouchableOpacity>
					</Box>

					{/* Center Button */}
					<Box className="w-20 relative">
						<TouchableOpacity onPress={() => navigateToScreen('Camera')} activeOpacity={0.7}>
							<Box
								className={`bg-[#00877D] bottom-[18px] rounded-full w-16 h-16 items-center self-center justify-center`}
							>
								<IC_AddPost className="w-9 h-9" color="white" />
							</Box>
						</TouchableOpacity>
					</Box>

					{/* Right Icons */}
					<Box className="flex-1 flex flex-row justify-around">
						<TouchableOpacity
							onPress={() => navigateToScreen('Leaderboard')}
							activeOpacity={0.7}
						>
							<Box className="flex-col items-center text-center">
								<IC_Leaderboard
									className="w-8 h-8"
									color={currentScreen === 'Leaderboard' ? '#00877D' : '#B0B9C1'}
								/>
							</Box>
						</TouchableOpacity>

						<TouchableOpacity 
							onPress={() => navigateToScreen('Profile')}
							activeOpacity={0.7}
							>
							<Box className="flex-col items-center text-center">
								<IC_Profile
									className="w-8 h-8"
									color={currentScreen === 'Profile' ? '#00877D' : '#B0B9C1'}
								/>
							</Box>
						</TouchableOpacity>
					</Box>
				</Box>
			</Box>
		</SafeAreaView>
	)
})

export default Layout
