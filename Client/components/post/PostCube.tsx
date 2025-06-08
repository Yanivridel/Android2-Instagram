import { isVideo } from '@/utils/functions/help';
import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef } from 'react';
import { Pressable, Image, Dimensions } from 'react-native';

type PostCubeProps = {
    imageUrl: string;
    onPress: () => void;
};

const screenWidth = Dimensions.get('window').width;
const cubeSize = screenWidth / 3;

export const PostCube: React.FC<PostCubeProps> = ({ imageUrl, onPress }) => {   
    const videoRef = useRef<Video>(null);

    useEffect(() => {
        return () => {
            if (videoRef.current?.unloadAsync) {
                videoRef.current.unloadAsync().catch(() => {});
            }
        };
    }, []);

    return (
        <Pressable
            onPress={onPress}
            className="p-[1.5px]"
            style={{ width: cubeSize, height: cubeSize }}
        >
            { isVideo(imageUrl) ? (
                <Video
                    ref={videoRef}
                    key={`postCube-video-${imageUrl}`}
                    source={{ uri: imageUrl }}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={false}
                    isMuted={true}
                    style={{ width: '100%', height: '100%' }}
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
