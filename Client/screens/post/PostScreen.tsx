import React, { useRef, useState, useEffect } from "react";
import { Text, TouchableOpacity, Image } from "react-native";
import { CameraView, CameraType, useCameraPermissions, Camera } from "expo-camera";
import { Box } from "@/components/ui/box";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { IC_Camera_Flip, IC_Flash, IC_NoFlash, IC_Vi } from "@/utils/constants/Icons";
import { Props } from "@/types/NavigationTypes";
import { uploadMedia } from "@/utils/api/external/CloudinaryAPI";
import { Audio } from 'expo-av';

interface PostScreenProps extends Props {}

export default function PostScreen({ navigation }: PostScreenProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraDirection, setCameraDirection] = useState<CameraType>("back");
    const [isFlashOn, setIsFlashOn] = useState(false);
    const cameraRef = useRef<any>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [camMode, setCamMode] = useState<'picture' | 'video'>('picture');
    const [isCameraReady, setIsCameraReady] = useState(false);

    // Camera Permissions
    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
        (async () => {
            const mic = await Audio.requestPermissionsAsync();
            if (!mic.granted) console.warn("Mic permission denied");
        })();
    }, [permission]);

    const onCameraReady = () => {
        console.log("Camera is ready");
        setIsCameraReady(true);
    };

    if (!permission) {
        return (
            <Box className="flex-1 items-center justify-center bg-white">
                <Text>Requesting camera permission...</Text>
            </Box>
        );
    }
    if (!permission.granted) {
        return (
            <Box className="flex-1 items-center justify-center bg-white">
                <Text>No camera access.</Text>
                <TouchableOpacity onPress={requestPermission} className="mt-4 px-4 py-2 bg-blue-500 rounded-lg">
                    <Text className="text-white">Grant Permission</Text>
                </TouchableOpacity>
            </Box>
        );
    }

    // Photo Taking
    const takePhoto = async () => {
        if (!isCameraReady || !cameraRef.current) return;
        try {
            const photo = await cameraRef.current.takePictureAsync();
            console.log("Photo taken:", photo.uri);
            await onPhotoTaken(photo.uri);
        } catch (error) {
            console.error("Failed to take photo:", error);
        }
    };

    const onPhotoTaken = async (photoUri: string) => {
        console.log("photoUri", photoUri);
        // const mediaUrl = await uploadMedia(photoUri, "post");
        // console.log("mediaUrl", mediaUrl);
    };

    // Video Recording
    const startRecording = async () => {
        if (!isCameraReady || isRecording || !cameraRef.current) return;
        try {
            console.log("Starting video recording...");
            setIsRecording(true);
            const video = await cameraRef.current.recordAsync({
                quality: '720p',
                maxDuration: 60, // 60 seconds max
            });
            console.log("Video recorded:", video.uri);
            await onVideoRecorded(video.uri);
        } catch (error) {
            console.error("Failed to record video:", error);
        } finally {
            setIsRecording(false);
        }
    };
    
    const stopRecording = async () => {
        if (isRecording && cameraRef.current) {
            try {
                console.log("Stopping video recording...");
                cameraRef.current.stopRecording();
            } catch (error) {
                console.error("Failed to stop recording:", error);
            }
        }
    };
    
    const onVideoRecorded = async (videoUri: string) => {
        console.log("videoUri", videoUri);
        // const mediaUrl = await uploadMedia(videoUri, "video");
        // console.log("mediaUrl", mediaUrl);
    };

    // Handle tap for photo, long press for video
    const handlePress = () => {
        if (!isCameraReady) return;
        if (camMode === 'picture') {
            takePhoto();
        }
    };

    const handleLongPress = () => {
        if (!isCameraReady) return;
        if (camMode === 'video' && !isRecording) {
            startRecording();
        }
    };

    const handlePressOut = () => {
        if (camMode === 'video' && isRecording) {
            stopRecording();
        }
    };

    return (
        <Box className="flex-1 bg-black">
            {/* Camera preview - removed the key prop that was causing remounting */}
            <CameraView
                ref={cameraRef}
                onCameraReady={onCameraReady}
                style={{ flex: 1 }}
                facing={cameraDirection}
                flash={isFlashOn ? "on" : "off"}
                mode={camMode}
            />
            <LinearGradient
                colors={['rgba(0,0,0,0.7)', 'transparent']}
                start={[0.5, 1]}
                end={[0.5, 0]}
                className="absolute inset-0"
            />

            {/* Bottom Controls */}
            <Box className="absolute bottom-[15%] left-0 right-0 px-8 flex-row justify-around items-center">
                {/* Flash */}
                <TouchableOpacity
                    onPress={() => setIsFlashOn(prev => !prev)}
                    className="w-14 h-14 bg-white rounded-full items-center justify-center"
                    >
                    {isFlashOn ? <IC_NoFlash className="w-8 h-8" /> : <IC_Flash className="w-8 h-8" />}
                </TouchableOpacity>

                {/* Capture */}
                <TouchableOpacity
                    onPress={handlePress}
                    onLongPress={handleLongPress}
                    onPressOut={handlePressOut}
                    delayLongPress={200}
                    className={`w-21 h-21 bg-purple-400 rounded-full items-center justify-center
                        ${isRecording ? 'bg-red-600' : 'bg-purple-400'}`}
                    >
                    <Box className="w-20 h-20 justify-center items-center bg-purple-600 border-4 rounded-full border-black">
                        {isRecording ? (
                            <Text className="text-white font-bold text-xs">REC</Text>
                        ) : (
                            <IC_Vi color="white" className="w-10 h-10" />
                        )}
                    </Box>
                </TouchableOpacity>

                {/* Flip */}
                <TouchableOpacity
                onPress={() => setCameraDirection(prev => (prev === "front" ? "back" : "front"))}
                className="w-14 h-14 bg-white rounded-full items-center justify-center"
                >
                <IC_Camera_Flip className="w-8 h-8" />
                </TouchableOpacity>
            </Box>
        
            {/* Mode Buttons */}
            <Box className="absolute bottom-[10%] left-0 right-0 flex-row justify-center items-center gap-4">
                <TouchableOpacity onPress={() => setCamMode('picture')}>
                    <Text className={`text-base font-semibold ${
                    camMode === 'picture' ? 'text-indigo-400' : 'text-gray-400'
                    }`}>
                    Picture
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setCamMode('video')}>
                    <Text className={`text-base font-semibold ${
                    camMode === 'video' ? 'text-indigo-400' : 'text-gray-400'
                    }`}>
                    Video
                    </Text>
                </TouchableOpacity>
            </Box>

            
            {/* Recording indicator */}
            {isRecording && (
                <Box className="absolute top-16 left-0 right-0 flex-row justify-center">
                    <Box className="bg-red-600 px-4 py-2 rounded-lg">
                        <Text className="text-white font-bold">● Recording...</Text>
                    </Box>
                </Box>
            )}
        </Box>
    );
}