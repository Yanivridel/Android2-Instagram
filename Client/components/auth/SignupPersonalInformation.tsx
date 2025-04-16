import React, { useEffect, useState } from 'react'
import { Box } from '../ui/box'
import { Text } from '../ui/text'
import InputAuth from './InputAuth'
import { Button, ButtonSpinner, ButtonText } from '../ui/button'
import { useFormInput } from '@/hooks/useFormInput'
import { SignUpScreensProps } from '@/types/NavigationTypes'
import { useTheme } from '@/utils/Themes/ThemeProvider'
import { convertBirthday } from '@/utils/functions/help'
import MyLinearGradient from '../gradient/MyLinearGradient'
import { useTranslation } from 'react-i18next'

interface SignupPersonalInformationProps extends SignUpScreensProps {
    setHeaderStep: React.Dispatch<React.SetStateAction<number | null>>;
}

function SignupPersonalInformation({ handleScreenChange, setHeaderStep, formHook }: SignupPersonalInformationProps) {
    const { appliedTheme } = useTheme();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const { values, errors, handleInputChange } =  formHook;
    const { fName, lName, birthday, ssn } = values

    const isActive = fName.trim() && lName.trim() && birthday.length === 14 && ssn.length === 4;

    useEffect(() => setHeaderStep(prev => prev !== 1 ? 1: prev), [])
    
    function handleSubmit() {
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            handleScreenChange('next');
        }, 1000);
    }

    return (
    <Box className='flex-1 justify-between'>
        {/* Title */}
        <Box className='mb-10 gap-7'>
            <Box className='gap-2'>
                <Text className={`text-3xl text-text-${appliedTheme} font-bold`}>{t('signupPersonalInformation.personalInfo')}</Text>
                <Text className={`text-subText-${appliedTheme} text-lg`}>
                    {t('signupPersonalInformation.verifyApplicationDetails')}
                </Text>
            </Box>
            {/* Inputs */}
            <Box className='gap-2'>
                <InputAuth
                    icon="IC_Person"
                    placeholder={t('signupPersonalInformation.firstNamePlaceholder')} // Translate "First Name"
                    value={fName}
                    onChangeText={(val) => handleInputChange("fName", val)}
                />
                <InputAuth
                    icon="IC_Person"
                    placeholder={t('signupPersonalInformation.lastNamePlaceholder')} // Translate "Last Name"
                    value={lName}
                    onChangeText={(val) => handleInputChange("lName", val)}
                />
                <InputAuth
                    icon="IC_Lock"
                    type='birthday'
                    placeholder={t('signupPersonalInformation.dateOfBirthPlaceholder')}
                    value={birthday}
                    onChangeText={(val) => handleInputChange("birthday", val)}
                />
                <InputAuth
                    icon="IC_Lock"
                    placeholder={t('signupPersonalInformation.ssnPlaceholder')}
                    keyboardType='numeric'
                    maxLength={4}
                    value={ssn}
                    onChangeText={(val) => handleInputChange("ssn", val)}
                />
                <Text className={`text-subTextGray-${appliedTheme} text-[12px]`}>
                    {t('signupPersonalInformation.encryptionInfo')}
                </Text>
            </Box>

            { errors.api && <Text className="text-red-500 text-sm ps-3 mb-1 -mt-1">{errors.api}</Text>}
        </Box>

        {/* Submit Button */}
        <MyLinearGradient type='button' color={ isActive ? 'purple' : "disabled-button"}>
            <Button onPress={() => isActive ? handleSubmit() : null}>
                <ButtonText className={ isActive ? `text-buttonText-${appliedTheme}` : `text-buttonDisableText-${appliedTheme}`}>
                    {isLoading ? <ButtonSpinner color="white" className='h-6'/> : t('signupPersonalInformation.continueButton')} {/* Translate "Continue" */}
                    </ButtonText>
            </Button>
        </MyLinearGradient>
    </Box>
    )
}

export default SignupPersonalInformation;