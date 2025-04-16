import { ScrollView, ImageBackground } from 'react-native'
import React from 'react'
import { Props } from 'types/NavigationTypes'
import { useTheme } from '@/utils/Themes/ThemeProvider'
import BackHeader from '@/components/BackHeader'
import { Badge, BadgeText } from '@/components/ui/badge'
import { Box } from '@/components/ui/box'
import {
	IC_BTCUSDT,
	IC_ETHUSDT,
	IC_Tothor_Logo_Only_Bold
} from '@/utils/constants/Icons'
import MyLinearGradient from '@/components/gradient/MyLinearGradient'
import { Text } from '@/components/ui/text'
import { useTranslation } from 'react-i18next'

interface BundleData {
	title: string
	description: string
	bestBundleTitle: string
	bundleName: string
	ytd: string
	risk: string
	additionalInfo: string
	icons: React.ComponentType[]
}

const icons = [IC_BTCUSDT, IC_ETHUSDT, IC_Tothor_Logo_Only_Bold]

const InvestmentsScreen: React.FC<Props> = ({ navigation }) => {
	const { appliedTheme } = useTheme()
	const { t } = useTranslation()

	const bundleData: BundleData = {
		title: t('investments.bundleTitle'),
		description: t('investments.bundleDescription'),
		bestBundleTitle: t('investments.bestBundles'),
		bundleName:'Make America Great Again!',
		ytd: t('investments.ytd'),
		risk: t('investments.risk'),
		additionalInfo: `+ ${icons.length.toString()}`,
		icons
	}

	return (
		<MyLinearGradient
			type="background"
			color={appliedTheme === 'dark' ? 'dark' : 'light-blue'}
			className="h-full"
		>
			<ScrollView>
				<MyLinearGradient
					type="background"
					color={appliedTheme === 'dark' ? 'blue' : 'purple'}
					className="h-[50%] p-4"
				>
					<BackHeader title={t('investments.header')} colorScheme="alwaysWhite" />

					<Box className="relative gap-4 z-[50]">
						<Box className="p-4 justify-center gap-2 items-center">
							<Text className="text-white font-bold text-[36px] text-center">
								{t('investments.bundlesTitle')}
							</Text>
							<Text className="text-white text-[16px] text-center">
								{t('investments.bundlesSubtitle')}
							</Text>
						</Box>

						
					</Box>
				</MyLinearGradient>
				<Text className={`text-text-${appliedTheme} text-[24px] font-bold self-start text-center p-2`}>
								{bundleData.bestBundleTitle}
							</Text>
				<Box className="relative z-[50] bottom-0 py-2 w-full h-60">
							<ImageBackground
								source={require('@assets/images/America.png')}
								className="h-full w-full"
							>
								<Text className="text-white text-[24px] font-bold items-center text-center p-4">
									{bundleData.bundleName}
								</Text>
								<Box className="absolute top-1/3 gap-2 flex-row p-2 ml-2 items-center">
									<Badge
										variant="solid"
										action="info"
										className={`rounded-full bg-card-${appliedTheme}`}
									>
										<BadgeText className="text-sm">{bundleData.ytd}</BadgeText>
									</Badge>
									<Badge
										variant="solid"
										action="info"
										className={`rounded-full bg-card-${appliedTheme}`}
									>
										<BadgeText className="text-sm">{bundleData.risk}</BadgeText>
									</Badge>

									<Text className="text-white text-[18px] font-bold self-center">
										{bundleData.additionalInfo}
									</Text>

									<ScrollView
										horizontal
										showsHorizontalScrollIndicator={false}
										className="overflow-x"
									>
										{bundleData.icons.map((Icon, index) => (
											<Box key={index} style={{ width: 32, height: 32 }}>
												<Icon />
											</Box>
										))}
									</ScrollView>
								</Box>
							</ImageBackground>
						</Box>
			</ScrollView>
		</MyLinearGradient>
	)
}

export default InvestmentsScreen
