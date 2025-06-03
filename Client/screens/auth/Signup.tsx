import InputAuth from '@/components/auth/InputAuth'
import MyLinearGradient from '@/components/gradient/MyLinearGradient'
import { Box } from '@/components/ui/box'
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useToast } from '@/components/ui/toast'
import { useFormInput } from '@/hooks/useFormInput'
import { setUser } from '@/store/slices/userSlices'
import { Props } from '@/types/NavigationTypes'
import { registerUser } from '@/utils/api/internal/user/userApi'
import { showNewToast } from '@/utils/constants/Toasts'
import { useTheme } from '@/utils/Themes/ThemeProvider'
import { IC_Vi } from '@/utils/constants/Icons'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'

const Signup: React.FC<Props> = ({ navigation }) => {
    const { appliedTheme } = useTheme()
    const { t } = useTranslation()
    
    const [isLoading, setIsLoading] = useState(false)
    const { values, errors, handleInputChange, setErrorByFields } = useFormInput({
        username: '',
        email: '',
        pass: '',
        api: ''
    })
    const { username, email, pass } = values
    const toast = useToast()
    const scrollViewRef = useRef<ScrollView>(null);

    // Password validation logic
    const isRightLength = pass.length >= 8
    const hasUppercaseOrSymbol = /[A-Z!@#$%^&*(),.?":{}|<>]/.test(pass)
    const hasNumber = /[0-9]/.test(pass)
    const isPasswordValid = hasUppercaseOrSymbol && isRightLength && hasNumber

    async function handleSubmitSignup() {
        let valid = true
        let newErrors = { username: "", email: "", pass: "" }

        // Validate username
        if (!username.trim()) {
            newErrors.username = "Username is required."
            valid = false
        } else if (username.length < 3) {
            newErrors.username = "Username must be at least 3 characters."
            valid = false
        }

        // Validate email format
        if (!email.trim()) {
            newErrors.email = "Email is required."
            valid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Invalid email format."
            valid = false
        }

        // Validate password
        if (!pass.trim()) {
            newErrors.pass = "Password is required."
            valid = false
        } else if (!isPasswordValid) {
            newErrors.pass = "Password must meet all requirements."
            valid = false
        }

        setErrorByFields(newErrors)

        if (valid) {
            setIsLoading(true)
            try {
                console.log({ username, email, password: pass })
                const user = await registerUser({ username, email, pass })

                if (user) {
                    showNewToast(
                        toast,
                        "unique-toast-signup-success",
                        "Signup successful",
                        "Account created successfully. Please login to continue.",
                    )
                
                    // Navigate to your app's login screen
                    setTimeout(() => {
                        navigation.navigate("Login")
                    }, 1000);
                } else {
                    showNewToast(
                        toast,
                        "unique-toast-signup-failed",
                        "Signup failed",
                        "Unable to create account. Please try again.",
                    )
                }

            } catch(err) {
                console.log("Error: ", err)
                showNewToast(
                    toast,
                    "unique-toast-signup-error",
                    "Signup Error",
                    "An error occurred during signup. Please try again.",
                )
            }
            finally {
                setIsLoading(false)
            }
        }
    }

    useEffect(() => {
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: true })
        })
    
        return () => {
            keyboardDidHideListener.remove()
        }
    }, [])

    return (
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
        <ScrollView 
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
        <MyLinearGradient className='flex-1' type='background' color={appliedTheme === "dark" ? 'dark' : 'light-blue'}>
            <Box className={`flex-1 p-10 pt-36 justify-between`}>
                <Box>
                    {/* Title */}
                    <Box className='my-10 gap-2'>
                        <Text className={`text-4xl text-text-${appliedTheme} font-bold`}>Create Account</Text>
                        <Text className={`text-xl text-subText-${appliedTheme}`}>Sign up to get started</Text>
                    </Box>
                    
                    {/* Main Signup */}
                    <Box className='gap-2'>
                        {/* Inputs */}
                        <InputAuth 
                            icon="IC_User"
                            placeholder="Username"
                            value={username}
                            onChangeText={(val) => handleInputChange("username", val)}
                            error={errors.username}
                        />
                        <InputAuth 
                            icon="IC_Email"
                            placeholder="Email address"
                            value={email}
                            onChangeText={(val) => handleInputChange("email", val)}
                            error={errors.email}
                        />
                        <InputAuth 
                            icon="IC_Lock"
                            placeholder="Password"
                            type='pass'
                            value={pass}
                            onChangeText={(val) => handleInputChange("pass", val)}
                            error={errors.pass}
                            onFocus={() => {
                                setTimeout(() => {
                                    scrollViewRef.current?.scrollToEnd({ animated: true })
                                }, 100) // Delay ensures keyboard opens first
                            }}
                        />

                        {/* Password Validation Section */}
                        <Box className='gap-1 mt-2 mb-2'>
                            <Box className='flex-row gap-3 items-center'>
                                <IC_Vi className='w-5 h-5 justify-center items-center' 
                                    color={isRightLength ? "green" : ""} />
                                <Text className={`text-subText-${appliedTheme} text-sm`}>At least 8 characters</Text>
                            </Box>
                            <Box className='flex-row gap-3 items-center'>
                                <IC_Vi className='w-5 h-5 justify-center items-center' 
                                    color={hasUppercaseOrSymbol ? 'green' : ''} />
                                <Text className={`text-subText-${appliedTheme} text-sm`}>Contains uppercase letter or symbol</Text>
                            </Box>
                            <Box className='flex-row gap-3 items-center'>
                                <IC_Vi className='w-5 h-5 justify-center items-center' 
                                    color={hasNumber ? 'green' : ''} />
                                <Text className={`text-subText-${appliedTheme} text-sm`}>Contains number</Text>
                            </Box>
                        </Box>

                        { errors.api && <Text className="text-red-500 text-sm ps-3 mb-1 -mt-1">{errors.api}</Text>}

                        {/* Terms and Privacy Policy */}
                        <Text className={`px-2 text-center text-sm text-subText-${appliedTheme} my-3`}>
                            By signing up, you agree to our{' '}
                            <Text className={`font-bold underline text-sm text-subText-${appliedTheme}`}
                            onPress={() => console.log("Terms of Use Clicked")}>
                                Terms of Use
                            </Text>
                            {' '}and{' '}
                            <Text className={`font-bold underline text-sm text-subText-${appliedTheme}`}
                            onPress={() => console.log("Privacy Policy Clicked")}>
                                Privacy Policy
                            </Text>
                        </Text>

                        {/* Signup Button */}
                        <MyLinearGradient type='button' color='purple'>
                            <Button onPress={handleSubmitSignup}>
                                <ButtonText className="text-white">
                                {isLoading ? <ButtonSpinner color={"white"} className="h-6" /> : "Create Account"}
                                </ButtonText>
                            </Button>
                        </MyLinearGradient>
                    </Box>
                </Box>

                {/* Sign In Link*/}
                <Box className='mx-auto flex-row mb-10'>
                    <Text className={`text-gray-${appliedTheme}`}>
                        Already have an account?
                        <Text className={`text-link-${appliedTheme} mx-auto font-bold tracking-wide`}
                        onPress={() => navigation.navigate("Login")}
                        > Sign in</Text>
                    </Text>
                </Box>
            </Box>
        </MyLinearGradient>
        </ScrollView>
    </KeyboardAvoidingView>
    )
}

export default Signup