import React, { useState, useRef, useEffect } from "react";
import { Text, TouchableOpacity, Image } from "react-native";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { idVerifyProps } from "@/types/NavigationTypes";
import { Box } from "../ui/box";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "../ui/linear-gradient";
import { IC_Camera_Flip, IC_Flash, IC_NoFlash, IC_Vi } from "@/utils/constants/Icons";
import { IM_FaceScan } from "@/utils/constants/Images";

function CaptureID({ handleScreenChange, finalData }: idVerifyProps) {
    const { t } = useTranslation(); 

    const [permission, requestPermission] = useCameraPermissions();
    const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
    const [backPhoto, setBackPhoto] = useState<string | null>(null);
    const [step, setStep] = useState(0);
    const cameraRef = useRef<any>(null);
    const [direction, setDirection] = useState<CameraType>(finalData?.type === "Selfie" ? "front" : "back");
    const [isFlash, setIsFlash] = useState(false);

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission]);

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                if (step === 0) {
                    setFrontPhoto(photo.uri);

                    if (finalData && finalData.type === "ID Card") {
                        setStep(1);
                    } else {
                        setTimeout(() => {
                            handleScreenChange('next', { 
                                frontIdPhoto: photo.uri, 
                                backIdPhoto: null 
                            });
                        }, 1000);
                    }
                } else if (step === 1) {
                    setBackPhoto(photo.uri);
                    setTimeout(() => {
                        handleScreenChange('next', { 
                            frontIdPhoto: frontPhoto, 
                            backIdPhoto: photo.uri 
                        });
                    }, 1000);
                }
            } catch (error) {
                console.error("Error taking picture:", error);
            }
        } else {
            console.log("Camera ref not available");
        }
    };

    if (!permission) {
        return (
            <Box className="flex-1 bg-white items-center justify-center">
                <Text>{t("camera.requestingPermission")}</Text>
            </Box>
        );
    }

    if (!permission.granted) {
        return (
            <Box className="flex-1 bg-white items-center justify-center">
                <Text>{t("camera.noAccess")}</Text>
                <TouchableOpacity 
                    onPress={requestPermission}
                    className="mt-4 py-2 px-4 bg-indigo-500 rounded-lg"
                >
                    <Text className="text-white">{t("camera.grantPermission")}</Text>
                </TouchableOpacity>
            </Box>
        );
    }

    const photoSide = step === 0 ? t("id.front") : t("id.back");

    return (
        <Box className="flex-1">
            <Box className="flex-1 gap-10 -mt-20 justify-evenly">
                <Box className="absolute inset-0">
                    <CameraView 
                        ref={cameraRef}
                        style={{ width: "100%", height: "100%"}}
                        facing={direction}
                    />
                </Box>

                <Box className="absolute inset-0">
                    <LinearGradient
                        colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.1)']}
                        locations={[0, 0.5, 1]}
                        start={[0.5, 1]}
                        end={[0.5, 0]}
                        className="absolute inset-0"
                    />
                </Box>

                <Box className="h-[10%]"></Box>

                { finalData?.type === "Selfie" ?
                <Box className="h-[40%] bg-transparent rounded-lg relative overflow-hidden w-[90%] mx-auto z-10">
                    <IM_FaceScan className="w-full h-full"/>
                </Box>
                :
                <Box className="h-[220px] bg-transparent rounded-lg relative overflow-hidden w-[90%] mx-auto z-10">
                    <Box className="absolute w-8 h-8 border-t-4 border-l-4 border-cyan-600 rounded-sm" />
                    <Box className="absolute right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-600 rounded-sm" />
                    <Box className="absolute bottom-0 w-8 h-8 border-b-4 border-l-4 border-cyan-600 rounded-sm" />
                    <Box className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-600 rounded-sm" />
                </Box>
                }

                {/* Instructions Section */}
                <Box className="items-center p-4 my-3 gap-5">
                    <Text className="text-3xl font-bold text-text-dark">
                        { finalData?.type === "Selfie" ?
                            t("id.centerYourFace") : `${photoSide} ${t("id.ofYourId")}`
                        }
                    </Text>
                    <Text className="text-subText-dark text-sm text-center w-2/3">
                        { finalData?.type === "Selfie" ?
                            t("id.alignFace") : t("id.positionId")
                        }
                    </Text>
                </Box>

                {/* Submit Section */}
                <Box className="flex-row justify-evenly items-center px-6 py-4">
                    {/* Flash */}
                    <TouchableOpacity 
                        onPress={() => setIsFlash(prev => !prev)}
                        className="w-14 h-14 bg-white rounded-full items-center justify-center"
                        activeOpacity={0.7}
                    >
                        { isFlash ?
                        <IC_NoFlash className="w-8 h-8"/>
                        :
                        <IC_Flash className="w-8 h-8"/>
                        }
                    </TouchableOpacity>

                    {/* Take Photo */}
                    <TouchableOpacity 
                        onPress={takePicture}
                        className="w-21 h-21 bg-purple-400 rounded-full items-center justify-center"
                    >
                        <Box className="w-20 h-20 justify-center items-center bg-purple-600 border-4 rounded-full  border-black">
                            <IC_Vi color="white" className="w-10 h-10"/>
                        </Box>
                    </TouchableOpacity>

                    {/* Flip Camera */}
                    <TouchableOpacity
                        onPress={() => setDirection(prev => prev === "front" ? "back": "front")}
                        className="w-14 h-14 bg-white rounded-full items-center justify-center"
                        activeOpacity={0.7}
                    >
                        <IC_Camera_Flip className="w-8 h-8"/>
                    </TouchableOpacity>
                </Box>
            </Box>
        </Box>
    );
}

export default CaptureID;
