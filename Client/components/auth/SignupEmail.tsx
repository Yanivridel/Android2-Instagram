import { Box } from '@/components/ui/box'
import React, { useEffect, useState } from 'react'
import { Text } from '../ui/text';
import { SignUpScreensProps } from '@/types/NavigationTypes';
import { IM_PhoneHand, IM_PhoneHandMain } from '@/utils/constants/Images';
import { Button, ButtonText } from '../ui/button';
import CountryPhoneInput from '../profile/CountryPhoneInput';
import { useTheme } from '@/utils/Themes/ThemeProvider';
import MyLinearGradient from '../gradient/MyLinearGradient';
import InputAuth from './InputAuth';
import { useTranslation } from 'react-i18next';

const SignupEmail = ({ handleScreenChange, formHook } : SignUpScreensProps) => {
    const { appliedTheme } = useTheme();
    const { t } = useTranslation();
    const { values, errors, handleInputChange, setErrorByFields } =  formHook;
    const { email } = values

    const handlePhoneSubmit = () => {
        if (!email?.trim())
            setErrorByFields({ email: t('signupEmail.emailRequired') });
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            setErrorByFields({ email: t('signupEmail.invalidEmailFormat') });
        else
            handleScreenChange("next");
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
                    <Text className={`text-3xl text-text-${appliedTheme} font-bold`}>{t('signupEmail.signIn')}</Text>
                    <Text className={`text-subText-${appliedTheme} text-lg`}>
                    {   t('signupEmail.enterEmailToLoginOrCreate')}
                    </Text>
                </Box>
            
            <InputAuth 
                value={email}
                onChangeText={(val) => handleInputChange("email", val)}
                icon={"IC_Email"}
                placeholder={t('signupEmail.emailPlaceholder')}
                error={errors.email}
            />
            </Box>
            {/* Buttons */}
            <Box className='gap-5'>
                <Text className={`px-2 text-center text-sm text-subText-${appliedTheme}`}>
                    {t('signupEmail.agreeToTerms')} 
                    <Text className={`font-bold underline text-sm text-subText-${appliedTheme}`}
                    onPress={() => console.log("Terms of Use Clicked")}>
                        {t('signupEmail.termsOfUse')} 
                    </Text>
                    {t('signupEmail.and')}
                    <Text className={`font-bold underline text-sm text-subText-${appliedTheme}`}
                    onPress={() => console.log("Privacy Policy Clicked")}
                    >
                        {t('signupEmail.privacyPolicy')}
                    </Text>
                </Text>
                <MyLinearGradient type='button' color='purple'>
                    <Button onPress={() => handlePhoneSubmit()} >
                        <ButtonText className="text-white">
                            {t('signupEmail.continueButton')}
                        </ButtonText>
                    </Button>
                </MyLinearGradient>
            </Box>
        </Box>
    </Box>
    )
}

export default SignupEmail