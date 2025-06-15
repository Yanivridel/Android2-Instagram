import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import React, { forwardRef, useImperativeHandle } from 'react';

export type ImagePickerHandlerRef = {
    pickImage: () => void;
};

type Props = {
    onImagePicked: (uri: string) => void;
};

const ImagePickerHandler = forwardRef<ImagePickerHandlerRef, Props>(
    ({ onImagePicked }, ref) => {
        const pickImage = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission to access gallery is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: false,
        });

        if (!result.canceled) {
            onImagePicked(result.assets[0].uri);
        }
        };

        useImperativeHandle(ref, () => ({
        pickImage,
        }));

        return null; // no UI, only logic
    }
);

export default ImagePickerHandler;
