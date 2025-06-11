import { Cloudinary } from '@cloudinary/url-gen';
import * as mime from 'react-native-mime-types';

import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UNSIGNED_NAME } from '@env';

console.log("CLOUDINARY_CLOUD_NAME", CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_UNSIGNED_NAME", CLOUDINARY_UNSIGNED_NAME);

export const cld = new Cloudinary({
    cloud: {
        cloudName: CLOUDINARY_CLOUD_NAME,
    },
    url: {
        secure: true,
    },
});

interface UploadResponse {
    secure_url: string;
    [key: string]: any;
}

export const uploadMedia = async (fileUri: string, fileName: string): Promise<string | null> => {
    const mimeType = mime.lookup(fileName) || 'application/octet-stream';
    const data = new FormData();
    data.append('file', {
        uri: fileUri,
        type: mimeType,
        name: fileName,
    } as any);
    data.append('upload_preset', CLOUDINARY_UNSIGNED_NAME);
    data.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
            method: 'POST',
            body: data,
        });
        const result: UploadResponse = await res.json();
        // console.log('Upload Success:', result.secure_url);
        return result.secure_url;
    } catch (error) {
        console.error('Upload Error:', error);
        return null;
    }
};
