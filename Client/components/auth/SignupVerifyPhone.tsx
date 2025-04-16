import { Box } from '@/components/ui/box'
import React, { useEffect, useRef, useState } from 'react'
import { Text } from '../ui/text';
import { SignUpScreensProps } from '@/types/NavigationTypes';
import { ButtonSpinner } from '../ui/button';
import { useToast } from '../ui/toast';
import { showNewToast } from '@/utils/constants/Toasts';
import { useTheme } from '@/utils/Themes/ThemeProvider';
import { Input, InputField } from '../ui/input';
import { Clipboard , KeyboardAvoidingView, Pressable } from 'react-native';
import { IM_PhoneHandConfirm } from '@/utils/constants/Images';
import OverlayLoading from '../OverlayLoading';
import { useTranslation } from 'react-i18next';

function SignupVerifyPhone({ handleScreenChange, formHook } : SignUpScreensProps) {
    const { appliedTheme } = useTheme();
    const { t } = useTranslation();
    const toast = useToast();
    const [isLoadingResend, setIsLoadingResend] = useState(false);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [timer, setTimer] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    const [codeInputs, setCodeInputs] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];

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

    function handleResendPhone() {
        setIsLoadingResend(true);

        // Reset Timer
        setIsResendDisabled(true);
        setTimer(60);

        setTimeout(() => {
            setIsLoadingResend(false);
            handleToast();
        }, 1000);
    }

    const handleToast = () => {
        const toastId = "unique-toast-phone-verification";
        if (!toast.isActive(toastId)) {
            showNewToast(
                toast, 
                toastId, 
                t('signupVerifyPhone.successToastTitle'),
                t('signupVerifyPhone.successToastMessage')
            );
        }
    };


    // Handle input change for each box
    const handleChange = (value: string, index: number) => {
        setError('');
        // Create a copy of the current state
        const newCodeInputs = [...codeInputs];
        // Update only the character at the specified index
        newCodeInputs[index] = value.slice(-1).toUpperCase();
        setCodeInputs(newCodeInputs);

        // Move to next input if current one is filled
        if (value && index < inputRefs.length - 1) {
            // @ts-ignore
            inputRefs[index + 1].current?.focus();
            setFocusedIndex(prev => prev+1);
        }
    };

    const handlePaste = async (index: number) => {
        try {
            const pastedText = await Clipboard.getString();
            if (pastedText) {
                const cleanedText = pastedText.trim().replace(/\s/g, '');
                
                // If pasted text is a 4-digit code
                if (/^\d{4}$/.test(cleanedText)) {
                    const newCodeInputs = cleanedText.split('').slice(0, 4);
                    setCodeInputs(newCodeInputs);
                    
                    // Focus the last input after paste
                    // @ts-ignore
                    inputRefs[3].current?.focus();
                }
            }
        } catch (error) {
            console.error('Failed to paste text:', error);
        }
    };

    // Handle key press for backspace functionality
    const handleKeyPress = (e: any, index: number) => {
        // If backspace is pressed and current input is empty, move to previous input
        if (e.nativeEvent.key === 'Backspace' && index > 0) {
            // @ts-ignore
            inputRefs[index - 1].current?.focus();
            setFocusedIndex(prev => prev-1);
        }
    };

    useEffect(() => {
        if (codeInputs.every(code => code !== '') && codeInputs.length === 4) {
            const code = codeInputs.join('')
            console.log("code", code);
            setIsLoadingSubmit(true);
            
            setTimeout(() => {
                setIsLoadingSubmit(false);
                handleScreenChange('next');
            }, 4000);
        }
    }, [codeInputs]);

    return (
    <Box className='flex-1 py-5'>
        { isLoadingSubmit && <OverlayLoading/> }
        
        {/* Main Image */}
        <Box className='mb-12'>
            <IM_PhoneHandConfirm className='h-[150px] -mt-3'/>
        </Box>

        <Box className='flex-1 justify-between'>
            <Box>
                {/* Titles */}
                <Box className='mb-7 gap-2'>
                    <Text className={`text-3xl text-text-${appliedTheme} font-bold`}>{t('signupVerifyPhone.confirm')}</Text>
                    <Text className={`text-subText-${appliedTheme} text-lg`}>
                        {t('signupVerifyPhone.enterCodeSentTo', { phoneNumber: [formHook.values.phonePrefix,formHook.values.phoneNumber].join(" - ") || "your phone" })}
                    </Text>
                </Box>
                {/* Code Input */}
                <KeyboardAvoidingView  >
                    <Box className="flex-row gap-3">
                    {inputRefs.map((ref, index) => (
                        <Input key={index}
                            className={`h-16 w-12 text-center rounded-lg bg-white px-1
                                bg-input-${appliedTheme}`}
                            style={{
                                borderColor: focusedIndex === index ? '#0093B9' : 'transparent',
                                borderWidth: focusedIndex === index ? 1 : 0
                            }}
                        >
                            <InputField
                            className={`text-xl text-text-${appliedTheme}`}
                            ref={ref}
                            value={codeInputs[index]}
                            onChangeText={(value) => handleChange(value, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            onFocus={() => setFocusedIndex(index)}
                            onBlur={() => setFocusedIndex(-1)}
                            // onPaste={() => {
                            //     if (index === 0) {
                            //     handlePaste(index);
                            //     }
                            // }}
                            keyboardType="numeric"
                            maxLength={1}
                            selectTextOnFocus
                            size="lg"
                            />
                        </Input>
                    ))}
                    </Box>
                    {error ? (
                    <Text className="text-red-500 text-center mt-2">{error}</Text>
                    ) : null}
                </KeyboardAvoidingView>
            </Box>

            {/* Resend Code */}
            <Pressable
                onPress={handleResendPhone}
                disabled={isResendDisabled}
                >
                    <Text className={`font-semibold ${appliedTheme === "dark" ? "text-white": "text-cyan-600"}`}>
                        {isLoadingResend ? <ButtonSpinner color={"#0093B9"} className='h-6'/> : 
                        isResendDisabled ? t('signupVerifyPhone.resendCodeIn', { timer }) : t('signupVerifyPhone.resendCode')} {/* Translate "Resend code in 00:{{timer}}" and "Resend code" */}
                    </Text>
            </Pressable>
        </Box>
    </Box>
    )
}

export default SignupVerifyPhone