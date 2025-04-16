import { Box } from '@/components/ui/box'
import React, { useEffect, useState } from 'react'
import { Text } from '../ui/text';
import { SignUpScreensProps } from '@/types/NavigationTypes';
import { IM_PhoneHand, IM_PhoneHandMain } from '@/utils/constants/Images';
import { Button, ButtonText } from '../ui/button';
import CountryPhoneInput from '../profile/CountryPhoneInput';
import { useTheme } from '@/utils/Themes/ThemeProvider';
import MyLinearGradient from '../gradient/MyLinearGradient';
import { useTranslation } from 'react-i18next';

function SignupPhoneNumber({ handleScreenChange, formHook } : SignUpScreensProps) {
    const { appliedTheme } = useTheme();
    const { t } = useTranslation();
    const { values, errors, handleInputChange, setErrorByFields } =  formHook;
    const { phoneNumber, phonePrefix } = values

    const handlePhoneSubmit = () => {
        if(!phoneNumber?.trim())
            setErrorByFields({ phoneNumber: t('signupPhoneNumber.phoneNumberRequired')})
        else if(phoneNumber.length < 9)
            setErrorByFields({ phoneNumber: t('signupPhoneNumber.phoneNumberTooShort')})
        else
            handleScreenChange('next')
    }

    return (
    <Box className='flex-1 py-5'>
        <Box className='mb-12'>
            <IM_PhoneHandMain className='h-[150px] -mt-3'/>
        </Box>

        <Box className='flex-1 justify-between'>
            <Box>
                {/* Titles */}
                <Box className='mb-7 gap-2'>
                    <Text className={`text-3xl text-text-${appliedTheme} font-bold`}>{t('signupPhoneNumber.phoneNumber')}</Text>
                    <Text className={`text-subText-${appliedTheme} text-lg`}>
                        {t('signupPhoneNumber.enterPhoneNumber')}
                    </Text>
                </Box>
            
                <CountryPhoneInput
                    error={errors.phoneNumber}
                    setError={(val) => setErrorByFields({ phoneNumber: val})}
                    prefix={phonePrefix}
                    setPrefix={(val) => handleInputChange("phonePrefix", val)}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={(val) => handleInputChange("phoneNumber", val)}/>
            </Box>
            {/* Buttons */}
            <Box className='gap-5'>
                <MyLinearGradient type='button' color='purple'>
                    <Button onPress={() => handlePhoneSubmit()}>
                        <ButtonText className="text-white">
                            {t('signupPhoneNumber.continueButton')}
                        </ButtonText>
                    </Button>
                </MyLinearGradient>
            </Box>
        </Box>
    </Box>
    )
}

export default SignupPhoneNumber