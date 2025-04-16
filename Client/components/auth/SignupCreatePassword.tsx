import { Box } from '@/components/ui/box'
import React from 'react'
import { Text } from '../ui/text';
import { SignUpScreensProps } from '@/types/NavigationTypes';
import { Button, ButtonText } from '../ui/button';
import { useTheme } from '@/utils/Themes/ThemeProvider';
import InputAuth from './InputAuth';
import { IM_PhoneHandPassword } from '@/utils/constants/Images';
import MyLinearGradient from '../gradient/MyLinearGradient';
import { IC_Vi } from '@/utils/constants/Icons';
import { useTranslation } from 'react-i18next';


function SignupCreatePassword({ handleScreenChange, formHook } : SignUpScreensProps) {
    const { appliedTheme } = useTheme();
    const { t } = useTranslation();
    const { values, handleInputChange } =  formHook;
    const { pass } = values

    const isRightLength = pass.length >= 8;
    const hasUppercaseOrSymbol = /[A-Z!@#$%^&*(),.?":{}|<>]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const isActive = hasUppercaseOrSymbol && isRightLength && hasNumber

    const handlePassSubmit = () => {
        handleScreenChange('next')
    }

    return (
    <Box className='flex-1 py-5'>
        {/* Main Image */}
        <Box className='mb-12'>
            <IM_PhoneHandPassword className='h-[150px] -mt-3'/>
        </Box>

        <Box className='flex-1 justify-between'>
            {/* Password Main Logic */}
            <Box className='flex-1 justify-between gap-5'>  
                {/* Titles */}
                <Box className='gap-2'>
                    <Text className={`text-3xl text-text-${appliedTheme} font-bold`}>{t('signupCreatePassword.createPassword')}</Text>
                    <Text className={`text-subText-${appliedTheme} text-lg`}>
                        {t('signupCreatePassword.chooseSecurePassword')}
                    </Text>
                </Box>

                {/* Code Input */}
                <Box className="flex-1 gap-2">
                    <InputAuth 
                        icon="IC_Lock" 
                        placeholder={t('signupCreatePassword.passwordPlaceholder')}
                        type='pass'
                        value={pass}
                        onChangeText={(val) => handleInputChange("pass", val)}
                    />

                    {/* Validation Section */}
                    <Box className='gap-1'>
                        <Box className='flex-row gap-3 items-center'>
                            <IC_Vi className='w-5 h-5 justify-center items-center' 
                                color={isRightLength ? "green" : ""} />
                            <Text className={`text-subText-${appliedTheme}`}>{t('signupCreatePassword.hasAtLeast8Chars')}</Text>
                        </Box>
                        <Box className='flex-row gap-3 items-center'>
                            <IC_Vi className='w-5 h-5 justify-center items-center' 
                                color={hasUppercaseOrSymbol ? 'green' : ''} />
                            <Text className={`text-subText-${appliedTheme}`}>{t('signupCreatePassword.hasUppercaseOrSymbol')}</Text>
                        </Box>
                        <Box className='flex-row gap-3 items-center'>
                            <IC_Vi className='w-5 h-5 justify-center items-center' 
                                color={hasNumber ? 'green' : ''} />
                            <Text className={`text-subText-${appliedTheme}`}>{t('signupCreatePassword.hasNumber')}</Text>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Buttons */}
            <Box className='gap-5'>
                <MyLinearGradient type='button' 
                    color={ isActive ? 'purple' : "disabled-button"}
                >
                    <Button onPress={() => isActive ? handlePassSubmit() : null}>
                        <ButtonText 
                        className={ isActive ? `text-buttonText-${appliedTheme}` : `text-buttonDisableText-${appliedTheme}`}>
                            {t('signupCreatePassword.continueButton')}
                        </ButtonText>
                    </Button>
                </MyLinearGradient>
            </Box>
        </Box>
    </Box>
    )
}

export default SignupCreatePassword