import { Box } from '@/components/ui/box'
import React, { useEffect, useState } from 'react'
import { Text } from '../ui/text';
import { SignUpScreensProps } from '@/types/NavigationTypes';
import { IM_Mailbox } from '@/utils/constants/Images';
import { Button, ButtonSpinner, ButtonText } from '../ui/button';
import { useToast } from '../ui/toast';
import { showNewToast } from '@/utils/constants/Toasts';
import { Linking } from 'react-native';
import { useTheme } from '@/utils/Themes/ThemeProvider';
import MyLinearGradient from '../gradient/MyLinearGradient';
import { useTranslation } from 'react-i18next';

function VerifyEmail({ handleScreenChange } : SignUpScreensProps) {
    const { appliedTheme } = useTheme();
    const { t } = useTranslation();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(false);

    useEffect(() => {
        if (timer > 0 && isResendDisabled) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(interval);
        } else {
            if (timer === 0) {
                setIsResendDisabled(false);
                setTimer(60);
            }
        }
    }, [timer, isResendDisabled]);

    function handleCheckInbox() {    
        // Open Gmail app
        Linking.canOpenURL('googlegmail://').then((supported) => {
            if (supported) {
                Linking.openURL('googlegmail://');
            } else {
                Linking.openURL('https://mail.google.com');
            }
        }).catch(err => console.error("Failed to open Gmail:", err));
    
        setTimeout(() => {
            handleScreenChange('next');
        }, 1000);
    }

    function handleResendEmail() {
        setIsLoading(true);

        // Reset Timer
        setIsResendDisabled(true);
        setTimer(60);

        setTimeout(() => {
            setIsLoading(false);
            handleToast();
        }, 1000);
    }

    const handleToast = () => {
        const toastId = "unique-toast-email-verification";
        if (!toast.isActive(toastId)) {
            showNewToast(
                toast, 
                toastId, 
                t('verifyEmail.successToastTitle'), 
                t('verifyEmail.successToastMessage')
            );
        }
    };

    return (
    <Box className='flex-1'>
        <Box className=''>
            <IM_Mailbox className='h-[300px] -mt-3'/>
        </Box>
        <Box className='flex-1 justify-between'>
            {/* Titles */}
            <Box className='gap-2'>
                <Text className={`text-3xl text-text-${appliedTheme} font-bold text-center`}>{t('verifyEmail.verifyYourEmail')}</Text>
                <Text className={`text-subText-${appliedTheme} text-lg text-center`}>
                    {t('verifyEmail.emailSentInstructions')}
                </Text>
            </Box>
            {/* Buttons */}
            <Box className='gap-3'>
                <MyLinearGradient type='button' color="purple">
                    <Button onPress={handleCheckInbox} >
                        <ButtonText className="text-white">
                            {t('verifyEmail.checkInboxButton')}
                        </ButtonText>
                    </Button>
                </MyLinearGradient>
                <MyLinearGradient type='button' color="gray">
                    <Button
                        onPress={handleResendEmail}
                        disabled={isResendDisabled}
                        >
                            <ButtonText className="text-[#828A99]">
                                {isLoading ? <ButtonSpinner color={"black"} className='h-6'/> : 
                                isResendDisabled ? t('verifyEmail.resendInTimer', { timer }) : t('verifyEmail.resendEmailButton')} {/* Translate "Resend email" and "Resend in {{timer}}s" */}
                            </ButtonText>
                    </Button>
                </MyLinearGradient>
            </Box>
        </Box>
    </Box>
    )
}

export default VerifyEmail