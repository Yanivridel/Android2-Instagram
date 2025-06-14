import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, Image, TextInput, Pressable, TouchableOpacity, SafeAreaView, BackHandler, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';
import AddressSearch from '@/components/auth/AddressSearchSheet';
import { Props } from '@/types/NavigationTypes';
import { Address } from '@/types/other';
import MyLinearGradient from '@/components/gradient/MyLinearGradient';
import { Box } from '@/components/ui/box';
import { isVideo } from '@/utils/functions/help';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { IC_ChevronLeft } from '@/utils/constants/Icons';
import { createPost, createPostReq } from '@/utils/api/internal/postApi';

interface HomeRouteType {
    params: {
        mediaUri: string;
    };
}

const PostComposerScreen: React.FC<Props> = ({ route, navigation }) => {
    const { mediaUri } = (route as HomeRouteType).params;
    const [isLoading, setIsLoading] = useState(false);
    
    const [content, setContent] = useState<string>('');
    const [address, setAddress] = useState<Address | null>(null);
    const [addressModalOpen, setAddressModalOpen] = useState<boolean>(false);
    const locationString = address && `${address?.country ?? ""} ${address?.city ?? ""}`

    const videoRef = useRef<Video>(null);
    const [videoError, setVideoError] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [shouldPlay, setShouldPlay] = useState(false);

    useEffect(() => {
        return () => {
            if (videoRef.current) {
                videoRef.current.unloadAsync().catch(() => {
                // Silent cleanup
                });
            }
        };
    }, []);

    useEffect(() => {
        const onBackPress = () => {
        navigation.goBack();
        return true; // prevent default behavior
        };
    
        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
        return () => subscription.remove();
    }, []);

    const handleBackPress = async () => {
        if (videoRef.current) {
            try {
                await videoRef.current.unloadAsync();
            } catch (e) {
                console.warn('Video unload error:', e);
            }
        }
        navigation.goBack();
        return true;
    };

    const handleVideoLoad = useCallback(() => {
        setIsVideoLoaded(true);
        if (isVideo(mediaUri)) {
        setShouldPlay(true);
        }
    }, [mediaUri]);
    
    const handleVideoError = useCallback(() => {
        console.warn('Video failed to load:', mediaUri);
        setVideoError(true);
        setShouldPlay(false);
    }, [mediaUri]);
    
    const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
            // Restart video when it finishes (for looping)
            if (videoRef.current) {
                videoRef.current.replayAsync().catch(() => {});
            }
        }
    }, []);

    const handlePost = async (): Promise<void> => {
        const payload: createPostReq = {
            content,
            imageUrls: [mediaUri],
            group: null,
            isPublic: true,
            locationString,
        };

        try {
            setIsLoading(true);
            await createPost(payload);

            navigation.reset({
                index: 0,
                routes: [
                {
                    name: 'MainApp',
                    params: { screen: 'Profile' }
                }
                ],
            });

        } catch (err) {
            console.error('Failed to create post:', err);
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleAddressSelect = (addr: Address | null): void => {
        setAddress(addr);
        setAddressModalOpen(false);
    };

    return (
    <>
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={{ flex: 1 }}
    >
        <ScrollView className="p-4 bg-white">
            {/* Top Back Bar */}
            <Box className={`flex-row justify-between p-8 mt-4 items-center relative`}>
                <TouchableOpacity
                    className="absolute left-4"
                    onPress={handleBackPress}
                    activeOpacity={0.7}
                >
                    <IC_ChevronLeft className="w-8 h-8" color={"black"} />
                </TouchableOpacity>
            </Box>
            {/* Media preview */}
            <Box className="relative w-full aspect-square overflow-hidden">
                {isVideo(mediaUri) && !videoError ? (
                    <Video
                    ref={videoRef}
                    key={`post-video-${mediaUri}`}
                    source={{ uri: mediaUri }}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={shouldPlay}
                    isLooping={false}
                    isMuted={false}
                    volume={0.8}
                    style={{ 
                        width: '100%', 
                        height: '100%',
                        backgroundColor: '#f0f0f0'
                    }}
                    onLoad={handleVideoLoad}
                    onError={handleVideoError}
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                    useNativeControls={false}
                    progressUpdateIntervalMillis={1000}
                    />
                ) : (
                <Image
                key={`post-image-${mediaUri}`}
                source={{ uri: mediaUri }}
                className="w-full h-full"
                resizeMode="cover"
                alt={`Post Media`}
                />
            )}
            </Box>

            {/* Post description */}
            <TextInput
                placeholder="Write a caption..."
                multiline
                value={content}
                onChangeText={setContent}
                className="border border-gray-300 p-3 rounded-lg my-4 text-base"
                style={{ minHeight: 100 }}
            />

            {/* Location */}
            <Button 
                variant="link"
                onPress={() => setAddressModalOpen(true)} 
                className="mb-4"
            >
                <ButtonText>
                    {locationString ? `📍 ${locationString}` : 'Select Location'}
                </ButtonText>
            </Button>

            {/* Publish */}
            <MyLinearGradient
                type='button'
                color={content ? 'turquoise-button': "gray"}
            >
                <Button onPress={handlePost} isDisabled={!content}>
                    <ButtonText>
                        Publish
                    </ButtonText>
                </Button>
            </MyLinearGradient>

            {/* Location Modal */}
            <AddressSearch
                isOpen={addressModalOpen}
                onClose={() => setAddressModalOpen(false)}
                onSetAddress={handleAddressSelect}
            />
        </ScrollView>
    </KeyboardAvoidingView>
    </>
    );
};

export default PostComposerScreen;