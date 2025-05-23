import React, { useEffect, useState } from 'react'
import { Box } from '../ui/box'
import { Text } from '../ui/text'
import { Button, ButtonSpinner, ButtonText } from '../ui/button'
import { SignUpScreensProps } from '@/types/NavigationTypes'
import { useTheme } from '@/utils/Themes/ThemeProvider'
import MyLinearGradient from '../gradient/MyLinearGradient'
import AddressSearch from './AddressSearchSheet'
import InputAuth from './InputAuth'
import { FlatList, Pressable, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { Address, SignupFinalDataType } from '@/types/other'
import { IC_CurrentLocation } from '@/utils/constants/Icons'
import { Divider } from '../ui/divider'
import { useTranslation } from 'react-i18next'

interface SignupPersonalInformationProps extends SignUpScreensProps {
    setHeaderStep: React.Dispatch<React.SetStateAction<number | null>>;
    navigation: any;
}

function SignupAlmostThere({ handleScreenChange, setHeaderStep, formHook, navigation}: SignupPersonalInformationProps) {
    const { appliedTheme } = useTheme();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const finalData = formHook.values;

    useEffect(() => setHeaderStep(prev => prev !== 3 ? 3: prev), [])
    
    function handleSubmit() {
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setIsModalOpen(true);
        }, 1000);
    }

    const dataToRender = [
        {
            title: t('signupAlmostThere.fullLegalName'),
            val: [finalData?.fName,finalData?.lName].join(" "),
            onclick: () => { handleScreenChange("PERSONAL_INFO",true) }},
        {
            title: t('signupAlmostThere.dateOfBirth'),
            val: finalData?.birthday,
            onclick: () => { handleScreenChange("PERSONAL_INFO",true) }},
        {
            title: t('signupAlmostThere.socialSecurityNumber'),
            val: "*" + finalData?.ssn,
            onclick: () => { handleScreenChange("PERSONAL_INFO", true) }},
        {
            title: t('signupAlmostThere.residentialAddress'),
            val: [finalData?.address.street, finalData?.address.subpremise , finalData?.address.city, finalData?.address.country, finalData?.address.postal ].join(", "),
            onclick: () => { handleScreenChange("ADDRESS", true) }
        },
    ]

    return (
    <Box className='flex-1 justify-between'>
        {/* Title */}
        <Box className='mb-10 gap-7 flex-1'>
            <Box className='gap-2'>
                <Text className={`text-3xl text-text-${appliedTheme} font-bold`}>{t('signupAlmostThere.almostThere')}</Text>
                <Text className={`text-subText-${appliedTheme} text-lg`}>
                    {t('signupAlmostThere.ensureInfoCorrect')}
                </Text>
            </Box>
            
            {/* Editable Options */}
            <Box >
            {dataToRender.map((item, idx) => 
            <Box key={item.title}>
                <Box className="flex-row items-center justify-between">
                    <Box className='w-2/3'>
                        <Text className={`text-sm text-inputPlaceholderText-${appliedTheme}`}>{item.title}</Text>
                        <Text className={`text-lg font-medium text-text-${appliedTheme} mt-1`}>{item.val}</Text>
                    </Box>
                    <Pressable className={`bg-card-${appliedTheme} rounded-full py-2 px-5`} onPress={item.onclick}>
                        <Text className={`font-semibold text-text-${appliedTheme}`}>Edit</Text>
                    </Pressable>
                </Box>
                {idx !== dataToRender.length-1 && <Divider className='my-4'/>}
            </Box>
            )}
            </Box>

        </Box>

        {/* Submit Button */}
        <MyLinearGradient type='button' color={'purple'}>
            <Button onPress={() => handleSubmit()} >
                <ButtonText className={`text-buttonText-${appliedTheme}`}>
                    {isLoading ? <ButtonSpinner color="white" className='h-6'/> : t('signupAlmostThere.continueButton')}
                </ButtonText>
            </Button>
        </MyLinearGradient>
    </Box>
    )
}

export default SignupAlmostThere;