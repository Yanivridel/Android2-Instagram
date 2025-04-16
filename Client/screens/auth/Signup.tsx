import BackAuth from '@/components/auth/BackAuth'
import SignupPersonalInformation from '@/components/auth/SignupPersonalInformation'
import SignupPhoneNumber from '@/components/auth/SignupPhoneNumber'
import SignupVerifyPhone from '@/components/auth/SignupVerifyPhone'
import SignupVerifyEmail from '@/components/auth/SignupVerifyEmail'
import MyLinearGradient from '@/components/gradient/MyLinearGradient'
import { Box } from '@/components/ui/box'
import { Props } from '@/types/NavigationTypes'
import { useTheme } from '@/utils/Themes/ThemeProvider'
import React, { useEffect, useRef, useState } from 'react'
import { BackHandler, Keyboard, ScrollView } from 'react-native'
import { Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import SignupCreatePassword from '@/components/auth/SignupCreatePassword'
import SignupAddress from '@/components/auth/SignupAddress'
import SignupAlmostThere from '@/components/auth/SignupAlmostThere'
import { Address } from '@/types/other'
import { useFormInput } from '@/hooks/useFormInput'
import SignupEmail from '@/components/auth/SignupEmail'

const Signup: React.FC<Props> = ({ navigation }) => {
    const { appliedTheme } = useTheme();
    const [screenStep , setScreenStep ] = useState("EMAIL");
    const [slideAnim] = useState(new Animated.Value(0));
    const [isGoingBack, setIsGoingBack] = useState(false);
    
    const formHook = useFormInput({
            phonePrefix: '',
            phoneNumber: '',
            email: '',
            pass: '',
            address: {} as Address,
            fName: '',
            lName: '',
            birthday: '',
            ssn: '',
            api: ''
    });

    const [ headerStep,  setHeaderStep] = useState<number | null>(null);
    const [ comeFromEdit, setComeFromEdit] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const screens = ['EMAIL', 'VERIFY_EMAIL', 'PHONE_NUMBER', 'VERIFY_PHONE', 
                    'CREATE_PASSWORD', 'PERSONAL_INFO', 'ADDRESS', "ALMOST_THERE"];

    useEffect(() => {
        console.log("FINAL DATA: ", formHook.values);
    }, [formHook.values]);

    const handleScreenChange = (newScreenStep: 'back' | 'next' | string, fromEdit = false) => {
        if (!['back', 'next'].includes(newScreenStep) && !screens.includes(newScreenStep)) {
            console.log("Invalid screen step");
            return null;
        }
        const isScreenName = typeof newScreenStep === 'string' && !['back', 'next'].includes(newScreenStep);

        let direction = 0; 
        let isGoingBack = false;

        if (isScreenName) {
            const currentIndex = screens.indexOf(screenStep);
            const targetIndex = screens.indexOf(newScreenStep);
            isGoingBack = targetIndex < currentIndex;
        } else {
            isGoingBack = newScreenStep === 'back';
        }

        setIsGoingBack(isGoingBack);
        direction = isGoingBack ? 1 : -1;

        if(fromEdit)
            setComeFromEdit(true);
        else
            setComeFromEdit(false);
        
        // Trigger the animation when changing the screenStep
        Animated.timing(slideAnim, {
            toValue: -1,
            duration: 100,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start(() => {

        // After slide-out animation ends, change the screen step
        const currentIndex = screens.indexOf(screenStep);
        if (isScreenName) {
            setScreenStep(newScreenStep);
            chooseHeaderStep(newScreenStep)

        } else if(newScreenStep === "next"){
            setScreenStep(comeFromEdit ? "ALMOST_THERE" : screens[currentIndex + 1]);
            chooseHeaderStep(newScreenStep)
            

        } else { // "back"
            if(screenStep === "EMAIL")
                navigation.navigate("Login");
            else
                setScreenStep(screens[currentIndex - 1]);

            setHeaderStep(prev => !prev ?  prev : prev === 1 ? null : prev - 1 )          
        }
    
        // Then, trigger the slide-in animation
        slideAnim.setValue(-direction);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
        });
    };

    function chooseHeaderStep(newScreenStep: string) {
        if(screenStep === "CREATE_PASSWORD")
            setHeaderStep(1);
        else if(screenStep === "")
            setHeaderStep(2);
        else if(screenStep === "")
            setHeaderStep(3);
        else
            setHeaderStep(null);
    }

    useEffect(() => {
        const backAction = () => {
        if(screenStep === "EMAIL")
            navigation.navigate("Login");
        else 
            handleScreenChange("back");
        return true; 
        };
    
        BackHandler.addEventListener('hardwareBackPress', backAction);
    
        // Cleanup listener on component unmount
        return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
        };
    }, [screenStep]);

    useEffect(() => {
        // Choosing screens without scrolling down
        console.log("screenStep", screenStep);
        if(["PERSONAL_INFO","ADDRESS"].includes(screenStep)) return;
        // Scroll down on all other
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 10); // Delay to make sure scroll works
        });
    
        return () => keyboardDidShowListener.remove();
    }, [screenStep]);

    return (
    <SafeAreaView>
        <ScrollView
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        >
        <MyLinearGradient type='background' color={appliedTheme === "dark" ? "dark" : 'light-blue'}>
        <Box className={`flex-1 min-h-screen`}>
            <BackAuth handleScreenChange={handleScreenChange} headerStep={headerStep}/>
            <Box className={`flex-1 p-10 pt-5`}>
                <Animated.View
                    className="flex-1"
                    style={{
                        transform: [
                            {
                            translateX: slideAnim.interpolate({
                                inputRange: [-1, 0, 1],
                                outputRange: [
                                isGoingBack ? 350 : -350, 0,
                                isGoingBack ? -350 : 350,
                                ],
                            }),
                            },
                        ],
                        opacity: slideAnim.interpolate({
                            inputRange: [-1, 0, 1],
                            outputRange: [0, 1, 0],
                        }),
                    }}
                >
                    { screenStep === 'EMAIL' && <SignupEmail formHook={formHook} handleScreenChange={handleScreenChange}/>}
                    { screenStep === 'VERIFY_EMAIL' && <SignupVerifyEmail formHook={formHook} handleScreenChange={handleScreenChange}/>}
                    { screenStep === 'PHONE_NUMBER' && <SignupPhoneNumber formHook={formHook} handleScreenChange={handleScreenChange}/>}
                    { screenStep === 'VERIFY_PHONE' && <SignupVerifyPhone formHook={formHook} handleScreenChange={handleScreenChange}/>}
                    { screenStep === 'CREATE_PASSWORD' && <SignupCreatePassword formHook={formHook} handleScreenChange={handleScreenChange} />}
                    { screenStep === 'PERSONAL_INFO' && <SignupPersonalInformation formHook={formHook} handleScreenChange={handleScreenChange} setHeaderStep={setHeaderStep}/>}
                    { screenStep === 'ADDRESS' && <SignupAddress formHook={formHook} handleScreenChange={handleScreenChange} setHeaderStep={setHeaderStep} />}
                    { screenStep === 'ALMOST_THERE' && <SignupAlmostThere formHook={formHook} navigation={navigation} handleScreenChange={handleScreenChange} setHeaderStep={setHeaderStep}/>}
                </Animated.View>
            </Box>
        </Box>
        </MyLinearGradient>
    </ScrollView>
    </SafeAreaView>
    )
}

export default Signup