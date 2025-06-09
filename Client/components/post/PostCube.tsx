import { isVideo } from '@/utils/functions/help';
import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Image, Dimensions } from 'react-native';

type PostCubeProps = {
    imageUrl: string;
    onPress: () => void;
};

const screenWidth = Dimensions.get('window').width;
const cubeSize = screenWidth / 3;

export const PostCube: React.FC<PostCubeProps> = ({ imageUrl, onPress }) => {   
    const videoRef = useRef<Video>(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        // Reset states when imageUrl changes
        setIsVideoLoaded(false);
        setHasError(false);

        return () => {
            // Cleanup video when component unmounts or imageUrl changes
            if (videoRef.current && isVideo(imageUrl)) {
                videoRef.current.unloadAsync().catch(() => {
                    // Silently handle cleanup errors
                });
            }
        };
    }, [imageUrl]);

    const handleVideoLoad = () => {
        setIsVideoLoaded(true);
    };

    const handleVideoError = () => {
        setHasError(true);
        console.warn('Video failed to load:', imageUrl);
    };

    // Fallback to image if video fails to load
    if (isVideo(imageUrl) && hasError) {
        return (
            <Pressable
                onPress={onPress}
                className="p-[1.5px]"
                style={{ width: cubeSize, height: cubeSize }}
            >
                <Image
                    key={`postCube-fallback-${imageUrl}`}
                    source={{ uri: imageUrl }}
                    className="w-full aspect-square bg-gray-200"
                    resizeMode="cover"
                />
            </Pressable>
        );
    }

    return (
        <Pressable
            onPress={onPress}
            className="p-[1.5px]"
            style={{ width: cubeSize, height: cubeSize }}
        >
            {isVideo(imageUrl) ? (
                <Video
                    ref={videoRef}
                    key={`postCube-video-${imageUrl}`}
                    source={{ uri: imageUrl }}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={false}
                    isMuted={true}
                    isLooping={false}
                    style={{ 
                        width: '100%', 
                        height: '100%',
                        backgroundColor: '#f0f0f0' // Placeholder background
                    }}
                    onLoad={handleVideoLoad}
                    onError={handleVideoError}
                    // Optimize for grid display
                    useNativeControls={false}
                    positionMillis={0} // Always start from beginning
                />
            ) : (
                <Image
                    key={`postCube-image-${imageUrl}`}
                    source={{ uri: imageUrl }}
                    className="w-full aspect-square"
                    resizeMode="cover"
                />
            )}
        </Pressable>
    );
};