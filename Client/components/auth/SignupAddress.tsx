import React, { useEffect, useState } from 'react'
import { Box } from '../ui/box'
import { Text } from '../ui/text'
import { Button, ButtonSpinner, ButtonText } from '../ui/button'
import { SignUpScreensProps } from '@/types/NavigationTypes'
import { useTheme } from '@/utils/Themes/ThemeProvider'
import MyLinearGradient from '../gradient/MyLinearGradient'
import AddressSearch from './AddressSearchSheet'
import InputAuth from './InputAuth'
import { Pressable, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { Address } from '@/types/other'
import { IC_CurrentLocation } from '@/utils/constants/Icons'
import { useTranslation } from 'react-i18next'

interface SignupPersonalInformationProps extends SignUpScreensProps {
    setHeaderStep: React.Dispatch<React.SetStateAction<number | null>>;
}

const dummyAddress = {"address": {"city": "Jerusalem", "coords": {"lat": 9.040974799999999, "lng": 7.494399499999999}, "country": "Israel", "place_id": "EiZFbWVrIFJlZmEnaW0gU3RyZWV0LCBKZXJ1c2FsZW0sIElzcmFlbCIuKiwKFAoSCasOiBsmKAMVEUZVPxWx5J3mEhQKEglL_ME01tcCFRHL4W5FPmJv2Q", "postal": "900103", "street": "Emek Refa'im Street"}}

function SignupAddress({ handleScreenChange, setHeaderStep, formHook }: SignupPersonalInformationProps) {
    const { appliedTheme } = useTheme();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [ address, setAddress] = useState<Address | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const isActive = !!address?.postal;

    useEffect(() => setHeaderStep(prev => prev !== 2 ? 2: prev), [])
    
    function handleSubmit() {
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            formHook.handleInputChange("address", address);
            handleScreenChange('next');
        }, 1000);
    }


    return (
    <Box className='flex-1 justify-between'>
        {/* Title */}
        <Box className='mb-10 gap-7 flex-1'>
            <Box className='gap-2'>
                <Text className={`text-3xl text-text-${appliedTheme} font-bold`}>{t('signupAddress.homeAddress')}</Text>
                <Text className={`text-subText-${appliedTheme} text-lg`}>
                    {t('signupAddress.sendDebitCard')}
                </Text>
            </Box>
            
            {/* Address Input */}
            <Box className='relative gap-2'>
                <InputAuth
                    value={address?.street || ""}
                    onChangeText={() => {}}
                    placeholder={t('signupAddress.streetAddressPlaceholder')} // Translate "Street address"
                    isReadOnly={true}
                />
                {!address && <Pressable onPress={() => setIsSheetOpen(true)}
                    className='absolute inset-0 z-10'
                />}

                {address && <>
                    <InputAuth
                        value={address?.city || ""}
                        onChangeText={() => {}}
                        placeholder={t('signupAddress.cityPlaceholder')} // Translate "City"
                        isReadOnly={true}
                    />
                    <InputAuth
                        value={address?.country || ""}
                        onChangeText={() => {}}
                        placeholder={t('signupAddress.statePlaceholder')} // Translate "State"
                        isReadOnly={true}
                    />
                    <InputAuth
                        value={address?.postal || ""}
                        onChangeText={(val) => setAddress((prev) => ({ ...prev!, postal: val }))}
                        placeholder={t('signupAddress.zipCodePlaceholder')}
                        keyboardType='numeric'
                        maxLength={10}
                    />
                </>}
                { address &&
                <Box className="mx-auto">
                    <TouchableOpacity
                        className="flex-row items-center gap-2"
                        onPress={() => {setAddress(null); setIsSheetOpen(true);}}
                        activeOpacity={0.6}
                    >
                        <IC_CurrentLocation className="w-5 h-5" />
                        <Text className="text-lg font-semibold text-purple-500">{t('signupAddress.selectAnotherAddress')}</Text> {/* Translate "Select Another Address" */}
                    </TouchableOpacity>
                </Box>
                }
            </Box>

            <AddressSearch
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                setAddress={setAddress}
            />
        </Box>

        {/* Submit Button */}
        <MyLinearGradient type='button' color={ isActive ? 'purple' : "disabled-button"}>
            <Button onPress={() => isActive ? handleSubmit() : null}>
                <ButtonText className={ isActive ? `text-buttonText-${appliedTheme}` : `text-buttonDisableText-${appliedTheme}`}>
                    {isLoading ? <ButtonSpinner color="white" className='h-6'/> : t('signupAddress.continueButton')} {/* Translate "Continue" */}
                    </ButtonText>
            </Button>
        </MyLinearGradient>
    </Box>
    )
}

export default SignupAddress;