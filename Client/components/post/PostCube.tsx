import React from 'react';
import { Pressable, Image, Dimensions } from 'react-native';

type PostCubeProps = {
  imageUrl: string;
  onPress: () => void;
};

const screenWidth = Dimensions.get('window').width;
const cubeSize = screenWidth / 3;

export const PostCube: React.FC<PostCubeProps> = ({ imageUrl, onPress }) => {    
    return (
        <Pressable
            onPress={onPress}
            className="p-[1.5px]"
            style={{ width: cubeSize, height: cubeSize }}
        >
            <Image
                source={{ uri: imageUrl }}
                className="w-full aspect-square"
                resizeMode="cover"
            />
        </Pressable>
        );
};
