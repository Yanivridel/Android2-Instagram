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

export const getAllPostsRandomized = async (): Promise<IPost[] | null> => {
    try {
        const { data } = await api.get<IPost[]>(`api/posts/`);
        return data;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};

export const getPostsByUserId = async ({ userId }: { userId: string}): Promise<IPost[] | null> => {
    try {
        const { data } = await api.get<IPost[]>(`api/posts/user/${userId}`);
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

export interface createPostReq {
    content: string,
    imageUrls: string[],
    group: string | null,
    isPublic: boolean,
    locationString: string | null
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

export const deletePost = async ({ postId }: { postId: string}): Promise<string | null> => {
    try {
        const { data } = await api.delete<string>(`api/posts/${postId}`);
        return data;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};

export const updatePost = async ({ postId, content }: { postId: string, content: string}): Promise<string | null> => {
    try {
        const { data } = await api.put<string>(`api/posts/${postId}`, { content });
        return data;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};
