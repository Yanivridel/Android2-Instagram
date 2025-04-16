import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box } from '../ui/box'
import RoundedBox from '../RoundedBox'
import { IC_Camera_Orange, IC_Camera_Purple, IC_Drivers_License, IC_ID_Card, IC_Illustration, IC_Passport, IC_Passport_Photo, IC_Scan_Face_Orange, IC_Scan_Face_Purple, IC_Selfie_Photo, IC_Tick_Selected } from '@/utils/constants/Icons'
import { useTheme } from '@/utils/Themes/ThemeProvider'
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetItem, ActionsheetItemText } from '../ui/actionsheet'
import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from '../ui/alert-dialog'
import MyLinearGradient from '../gradient/MyLinearGradient'
import { Button, ButtonText } from '../ui/button'
import SettingItem from '../SettingItems'
import { Divider } from '../ui/divider'
import { idVerifyProps, TNavigation } from '@/types/NavigationTypes'
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'

const IdVerificationMain = ({ handleScreenChange, finalData }: idVerifyProps) => {
	const { t } = useTranslation()
	const { appliedTheme } = useTheme()
	const [showActionSheet, setShowActionSheet] = useState(false)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const navigation = useNavigation<TNavigation>()

	const isActive = !!finalData?.isGov && !!finalData?.isSelfie

	return (
		<ScrollView>
			<Box className='flex-1 p-4 h-full justify-between'>
				<Box className='gap-4'>
					{/* Government ID Section */}
					<Box>
						<RoundedBox>
							<IC_Passport_Photo />
							{finalData?.isGov && <IC_Tick_Selected className='-mt-14' />}
							<Box className='flex flex-col items-center'>
								<Text className={`text-text-${appliedTheme} font-bold text-[20px]`}>
									{t('verify.govTitle')}
								</Text>
								<Text className={`text-subTextGray-${appliedTheme} p-4 text-center text-[16px]`}>
									{t('verify.govSubtitle')}
								</Text>
							</Box>

							<TouchableOpacity onPress={() => setShowActionSheet(true)}>
								<Box className='flex flex-row items-center gap-2 p-2 justify-center'>
									{finalData?.isGov ? (
										<IC_Camera_Orange className='w-8 h-8' />
									) : (
										<IC_Camera_Purple className='w-8 h-8' />
									)}
									<Text className={`font-bold text-[17px] ${finalData?.isGov ? 'text-orange' : 'text-purple-500'}`}>
										{t('verify.takePhoto')}
									</Text>
								</Box>
							</TouchableOpacity>
						</RoundedBox>
					</Box>

					{/* Selfie Section */}
					<Box>
						<RoundedBox>
							<IC_Selfie_Photo />
							{finalData?.isSelfie && <IC_Tick_Selected className='-mt-14' />}
							<Box className='flex flex-col items-center'>
								<Text className={`text-text-${appliedTheme} font-bold text-[20px]`}>
									{t('verify.selfieTitle')}
								</Text>
								<Text className={`text-subTextGray-${appliedTheme} p-4 text-center text-[16px]`}>
									{t('verify.selfieSubtitle')}
								</Text>
							</Box>

							<TouchableOpacity onPress={() => handleScreenChange('CAMERA', { type: 'Selfie' })}>
								<Box className='flex flex-row items-center gap-2 p-2 justify-center'>
									{finalData?.isSelfie ? (
										<IC_Scan_Face_Orange className='w-8 h-8' />
									) : (
										<IC_Scan_Face_Purple className='w-8 h-8' />
									)}
									<Text className={`font-bold text-[17px] ${finalData?.isSelfie ? 'text-orange' : 'text-purple-500'}`}>
										{t('verify.takeSelfie')}
									</Text>
								</Box>
							</TouchableOpacity>
						</RoundedBox>
					</Box>

					{/* Submit Button */}
					<MyLinearGradient type='button' color={isActive ? 'purple' : 'disabled-button'}>
						<Button onPress={() => isActive ? setIsDialogOpen(true) : null}>
							<ButtonText className={isActive ? `text-buttonText-${appliedTheme}` : `text-buttonDisableText-${appliedTheme}`}>
								{t('verify.verifyButton')}
							</ButtonText>
						</Button>
					</MyLinearGradient>

					<Box className='p-2' />
				</Box>

				{/* Action Sheet */}
				<Actionsheet isOpen={showActionSheet} onClose={() => setShowActionSheet(false)}>
					<ActionsheetBackdrop />
					<ActionsheetContent className={`bg-${appliedTheme === 'light' ? 'white' : 'background-dark'}`}>
						<ActionsheetDragIndicatorWrapper>
							<ActionsheetDragIndicator />
						</ActionsheetDragIndicatorWrapper>

						<ActionsheetItem onPress={() => handleScreenChange('CAMERA', { type: "Driver's License" })}>
							<ActionsheetItemText>
								<SettingItem IconComponent={IC_Drivers_License} title={t('verify.driverLicense')} />
							</ActionsheetItemText>
						</ActionsheetItem>

						<Divider />

						<ActionsheetItem onPress={() => handleScreenChange('CAMERA', { type: 'ID Card' })}>
							<ActionsheetItemText>
								<SettingItem IconComponent={IC_ID_Card} title={t('verify.idCard')} />
							</ActionsheetItemText>
						</ActionsheetItem>

						<Divider />

						<ActionsheetItem onPress={() => handleScreenChange('CAMERA', { type: 'Passport' })}>
							<ActionsheetItemText>
								<SettingItem IconComponent={IC_Passport} title={t('verify.passport')} badge={t('verify.recommended')} />
							</ActionsheetItemText>
						</ActionsheetItem>
					</ActionsheetContent>
				</Actionsheet>

				{/* Alert Dialog */}
				<AlertDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
					<AlertDialogBackdrop />
					<AlertDialogContent className={`bg-${appliedTheme === 'light' ? 'white' : 'background-dark'} rounded-3xl`}>
						<Box className='flex gap-10 h-fit flex-col items-center'>
							<AlertDialogHeader>
								<Box className='flex flex-col items-center gap-4'>
									<IC_Illustration />
									<Text className={`text-[20px] font-bold text-text-${appliedTheme} text-center`}>
										{t('verify.dialogTitle')}
									</Text>
								</Box>
							</AlertDialogHeader>

							<AlertDialogBody>
								<Text className={`text-[15px] font-medium text-subText-${appliedTheme} text-center`}>
									{t('verify.dialogBody')}
								</Text>
							</AlertDialogBody>

							<AlertDialogFooter>
								<MyLinearGradient type='button' color='purple'>
									<Button className='w-full' onPress={() => {
										setIsDialogOpen(false)
										navigation.goBack()
									}}>
										<ButtonText>{t('verify.gotIt')}</ButtonText>
									</Button>
								</MyLinearGradient>
							</AlertDialogFooter>
						</Box>
					</AlertDialogContent>
				</AlertDialog>
			</Box>
		</ScrollView>
	)
}

export default IdVerificationMain
