import { Alert, TouchableOpacity } from 'react-native'
import { Box } from './ui/box'
import { IC_Tothor_Logo_Only_Bold } from '@/utils/constants/Icons'
import { Text } from './ui/text'
import { useState, useMemo, useCallback, useRef } from 'react'
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from './ui/slider'
import ButtonsTrain from './ButtonsTrain'
import { useTheme } from '@/utils/Themes/ThemeProvider'
import MyLinearGradient from './gradient/MyLinearGradient'
import {
	Actionsheet,
	ActionsheetBackdrop,
	ActionsheetContent,
	ActionsheetDragIndicator,
	ActionsheetDragIndicatorWrapper
} from '@/components/ui/actionsheet'
import { formatNumber } from '@/utils/functions/help'
import { useTranslation } from 'react-i18next'

interface DropdownTothorProps {
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DropdownTothor({ isOpen, setIsOpen }: DropdownTothorProps) {
	const { appliedTheme } = useTheme()
	const { t } = useTranslation()

	const [exitTimeMonths, setExitTimeMonths] = useState(0)
	const [value, setValue] = useState(0)

	const maxValue = 123456
	const lastValue = useRef(value)

	const textColor = `text-text-${appliedTheme}`
	const logoColor = appliedTheme === 'dark' ? 'white' : 'black'
	const gradientColor = appliedTheme === 'dark' ? 'blue' : 'purple'

	const exitDate = useMemo(() => {
		const date = new Date()
		date.setMonth(date.getMonth() + exitTimeMonths)
		return exitTimeMonths !== 0 ? date.toLocaleDateString() : ''
	}, [exitTimeMonths])

	const handleClose = () => setIsOpen(false)

	const handlePressChange = useCallback(
		(newCategory: string) => {
			const months = parseInt(newCategory.match(/\d+/)?.[0] || '0', 10)
			if (exitTimeMonths !== months) {
				setExitTimeMonths(months)
			}
		},
		[exitTimeMonths]
	)

	const expectedValue = useMemo(() => {
		return exitTimeMonths === 3 ? 6.7 : exitTimeMonths === 6 ? 7.8 : exitTimeMonths === 12 ? 8.9 : 0
	}, [exitTimeMonths])

	const handleSliderChange = useCallback((newValue: any) => {
		if (lastValue.current !== newValue) {
			lastValue.current = newValue
			requestAnimationFrame(() => setValue(newValue))
		}
	}, [])

	return (
		<Actionsheet isOpen={isOpen} onClose={handleClose}>
			<ActionsheetBackdrop />
			<ActionsheetContent
				className={`bg-background-${appliedTheme} rounded-t-3x flex items-center justify-evenly gap-4`}
			>
				<ActionsheetDragIndicatorWrapper>
					<ActionsheetDragIndicator />
				</ActionsheetDragIndicatorWrapper>

				{/* Logo */}
				<MyLinearGradient type="background" color={gradientColor} className="w-fit rounded-full p-4">
					<IC_Tothor_Logo_Only_Bold color="white" className="h-14 w-14" />
				</MyLinearGradient>

				{/* Entry & Exit Dates */}
				<Box className="flex w-full flex-row justify-between">
					<Text className={textColor}>
						{t('dropdown.entry_date')}: {new Date().toLocaleDateString()}
					</Text>
					<Text className={textColor}>
						{t('dropdown.exit_date')}: {exitDate}
					</Text>
				</Box>

				{/* Slider */}
				<Box className="mt-6 flex w-full flex-row items-center justify-between">
					<Text className={textColor}>0</Text>
					<Slider
						minValue={0}
						maxValue={maxValue}
						className="w-2/3"
						defaultValue={value}
						step={1}
						size="md"
						orientation="horizontal"
						isDisabled={false}
						isReversed={false}
						onChange={handleSliderChange}
					>
						<SliderTrack>
							<SliderFilledTrack />
						</SliderTrack>
						<SliderThumb shape="circle">
							<Box className={`relative bottom-10 h-10 w-40 justify-center `}>
								<Text className={`${textColor} w-full text-start`}>
									{value.toLocaleString()}
								</Text>
							</Box>
						</SliderThumb>
					</Slider>
					<Text className={textColor}>{formatNumber(maxValue)}</Text>
				</Box>

				{/* Lock for */}
				<Text className={`${textColor} self-start text-[24px] font-bold`}>
					{t('dropdown.lock_for')}
				</Text>
				<ButtonsTrain
					buttons={[t('dropdown.months_3'), t('dropdown.months_6'), t('dropdown.months_12')]}
					activeButton={`${exitTimeMonths} ${t('dropdown.months')}`}
					handlePress={handlePressChange}
				/>

				{/* Expected Interest */}
				<Box
					className={`flex flex-row items-center justify-center gap-5 rounded-xl  p-5 bg-card-${appliedTheme}`}
				>
					<IC_Tothor_Logo_Only_Bold color={logoColor} className="h-8 w-8" />
					<Text className={textColor}>
						{t('dropdown.expected_interest')}: {expectedValue}%
					</Text>
				</Box>

				{/* Buy Button */}
				<MyLinearGradient type="button" color={gradientColor} className="m-10 w-full">
					<TouchableOpacity
						className="flex w-[95%] items-center justify-center"
						onPress={() => {
							if (exitTimeMonths && value) {
								Alert.alert(t('dropdown.alert.soon_title'), t('dropdown.alert.soon_msg'))
							} else {
								Alert.alert(t('dropdown.alert.missing_title'), t('dropdown.alert.missing_msg'))
							}
						}}
					>
						<Text className="font-semibold text-white" size="2xl">
							{t('dropdown.buy_now')}
						</Text>
					</TouchableOpacity>
				</MyLinearGradient>
			</ActionsheetContent>
		</Actionsheet>
	)
}
