import { IPost } from '@/types/postTypes';
import { api } from './apiService';


export const getAllMyPosts = async (): Promise<IPost[] | null> => {
    try {
        const { data } = await api.get<IPost[]>(`api/posts/me`);
        return data;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};

export const getPostsByUserId = async ({ userId }: { userId: string}): Promise<IPost[] | null> => {
    try {
        const { data } = await api.get<IPost[]>(`api/posts/${userId}`);
        return data;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};

export const getPostById = async ({ postId }: { postId: string}): Promise<IPost | null> => {
    try {
        const { data } = await api.get<IPost>(`api/posts/${postId}`);
        return data;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};

interface createPostReq {
    content: string,
    imageUrls: string[],
    group: string,
    isPublic: boolean,
    locationString: string
}
export const createPost = async ({ content, imageUrls, group, isPublic, locationString}: createPostReq): Promise<IPost | null> => {
    try {
        const { data } = await api.post<IPost>(`api/posts/`, { content, imageUrls, group, isPublic, locationString});
        return data;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};

