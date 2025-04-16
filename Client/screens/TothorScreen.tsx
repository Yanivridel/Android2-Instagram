import BackHeader from '@/components/BackHeader'
import CardUpRounded from '@/components/CardUpRounded'
import DropdownTothor from '@/components/DropdownTothor'
import MyLinearGradient from '@/components/gradient/MyLinearGradient'
import LineChartWagmi from '@/components/LineChartWagmi'
import { Box } from '@/components/ui/box'
import { Button, ButtonText } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import {
	IC_Info_Circle,
	IC_Tothor_Logo_Only
} from '@/utils/constants/Icons'
import { useTheme } from '@/utils/Themes/ThemeProvider'
import React, { useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import TothorCards from '@/components/TothorCards'
import { useTranslation } from 'react-i18next'

const TothorScreen = () => {
	const { appliedTheme } = useTheme()
	const { t } = useTranslation()
	const [isOpen, setIsOpen] = useState(false)

	return (
		<Box className={`bg-background-${appliedTheme} h-full`}>
			<MyLinearGradient
				className='h-[30%]'
				type="background"
				color={appliedTheme === 'dark' ? 'blue' : 'purple'}
			>
				<BackHeader title="Tothor" colorScheme="alwaysWhite" />
				<Box className="items-center justify-center">
					<Box className="items-center justify-center">
						<Box className={`p-4 bg-background-${appliedTheme} rounded-full z-10`}>
							<IC_Tothor_Logo_Only
								className="w-16 h-16"
								color={appliedTheme === 'dark' ? 'white' : 'black'}
							/>
						</Box>
					</Box>
				</Box>
			</MyLinearGradient>

			<CardUpRounded variant="gradient" className="p-4">
				<ScrollView bounces={false} showsVerticalScrollIndicator={false} className="mt-10">
					<Box>
						{/* Description Card */}
						<TothorCards>
							<Box className="items-center justify-center gap-4 p-4">
								<Text
									className={`text-[24px] font-medium text-center text-text-${appliedTheme}`}
								>
									{t('tothor.heading')}
								</Text>
								<Text
									className={`text-[16px] text-center text-text-${appliedTheme}`}
								>
									{t('tothor.description')}
								</Text>
							</Box>
						</TothorCards>

						<Box className="p-4" />

						{/* Token Info Card */}
						<TothorCards>
							<Box className="items-center justify-center gap-4 p-4">
								<Text
									className={`text-[24px] font-medium text-text-${appliedTheme}`}
								>
									{t('tothor.tokenTitle')}
								</Text>
								<Box className="flex-row gap-2">
									<Text
										className={`text-[24px] font-medium text-center text-text-${appliedTheme}`}
									>
										0,722$
									</Text>
									<Text
										className={`text-[12px] font-medium text-center self-end text-text-${appliedTheme}`}
									>
										(+0.57%)
									</Text>
								</Box>
								<Box className="flex-row gap-2">
									<Text
										className={`text-[12px] font-medium text-center text-text-${appliedTheme}`}
									>
										{t('tothor.currentPrice')}
									</Text>
									<IC_Info_Circle className="w-5 h-5" />
								</Box>
								<Text
									className={`text-[18px] font-bold text-center text-text-${appliedTheme}`}
								>
									{t('tothor.tokenEquation')}
								</Text>
								<LineChartWagmi
									color={appliedTheme === 'dark' ? 'white' : '#4A3EF6'}
									className="h-[100px]"
								/>
							</Box>
						</TothorCards>
					</Box>

					<Box className="p-2" />

					<MyLinearGradient
						type="button"
						color={appliedTheme === 'dark' ? 'blue' : 'purple'}
					>
						<Button onPress={() => setIsOpen(true)}>
							<ButtonText className="text-[16px]">
								{t('tothor.cta')}
							</ButtonText>
							{isOpen && <DropdownTothor isOpen={isOpen} setIsOpen={setIsOpen} />}
						</Button>
					</MyLinearGradient>
				</ScrollView>
			</CardUpRounded>

			<Box className="p-2" />
		</Box>
	)
}

export default TothorScreen
