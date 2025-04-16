import InputAuth from '@/components/auth/InputAuth'
import MyLinearGradient from '@/components/gradient/MyLinearGradient'
import { Box } from '@/components/ui/box'
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useToast } from '@/components/ui/toast'
import { FirebaseAuth } from '@/FirebaseConfig'
import { useFormInput } from '@/hooks/useFormInput'
import { Props } from '@/types/NavigationTypes'
import { handleToast, showNewToast } from '@/utils/constants/Toasts'
import { useTheme } from '@/utils/Themes/ThemeProvider'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'

const Login: React.FC<Props> = ({ navigation }) => {
    const { appliedTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const { values, errors, handleInputChange, setErrorByFields } = useFormInput({
        email: '',
        pass: '',
        api: ''
    });
    const { email, pass } = values;
    const toast = useToast();

    async function handleSubmitLogin() {
        let valid = true;
        let newErrors = { email: "", pass: "" };

        // Validate email format
        if (!email.trim()) {
            newErrors.email = "Email is required.";
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Invalid email format.";
            valid = false;
        }

        // Validate password
        if (!pass.trim()) {
            newErrors.pass = "Password is required.";
            valid = false;
        } else if (pass.length < 6) {
            newErrors.pass = "Password must be at least 6 characters.";
            valid = false;
        }

        setErrorByFields(newErrors)

        if (valid) {
            setIsLoading(true);
            try {
                console.log({ email, password: pass });
                const data = await signInWithEmailAndPassword(FirebaseAuth , email , pass);
                handleToast(toast, "unique-toast-success-verification", "Success", "It Worked");
                console.log(data);

            } catch(err) {
                console.log("Error: ", err);
                handleToast(toast, "unique-toast-error-verification", "Error", "It didn't Worked");
            }
        }
    }

    

    return (
    <MyLinearGradient type='background' color={appliedTheme === "dark" ? 'dark' : 'light-blue'}>
    <Box className={`h-full p-10 pt-36 justify-between`}>
        <Box>
            {/* Title */}
            <Box className='my-10 gap-2'>
                <Text className={`text-4xl text-text-${appliedTheme} font-bold`}>Welcome</Text>
                <Text className={`text-xl text-subText-${appliedTheme}`}>Sign in to your account</Text>
            </Box>
            {/* Main Login */}
            <Box className='gap-2'>
                {/* Inputs */}
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
                />

                { errors.api && <Text className="text-red-500 text-sm ps-3 mb-1 -mt-1">{errors.api}</Text>}
                {/* Login Button & Forgot Pass */}
                <MyLinearGradient type='button' color='purple'>
                    <Button onPress={handleSubmitLogin}>
                        <ButtonText className="text-white">
                        {isLoading ? <ButtonSpinner color={"white"} className="h-6" /> : "Sign in"}
                        </ButtonText>
                    </Button>
                </MyLinearGradient>
                <Text className={`text-link-${appliedTheme} my-3 mx-auto font-bold tracking-wide`}>
                    Forgot your password?
                </Text>
            </Box>
        </Box>

        {/* Sign Up Link*/}
        <Box className='mx-auto flex-row'>
            <Text className={`text-gray-${appliedTheme}`}>
                Don't have an account?
                <Text className={`text-link-${appliedTheme} mx-auto font-bold tracking-wide`}
                onPress={() => navigation.navigate("Signup")}
                > Sign up</Text>
            </Text>
        </Box>
    </Box>
    </MyLinearGradient>
    )
}

export default Login
