import { api } from './apiService';
import { IComment } from '@/types/commentTypes';

export const getCommentsByPostId = async ({ postId }: { postId: string}): Promise<IComment[] | null> => {
    try {
        const { data } = await api.get<IComment[]>(`api/comments/post/${postId}`);
        return data;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};

interface createCommentReq {
    content: string,
    postId: string,
    parentCommentId: string
}
export const createComment = async ({ content, postId, parentCommentId}: createCommentReq): Promise<IComment | null> => {
    try {
        const { data } = await api.post<IComment>(`api/comments/`, { content, postId, parentCommentId});
        return data;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};

export const deleteComment = async ({ commentId }: { commentId: string }): Promise<string | null> => {
    try {
        const { data } = await api.delete<string>(`api/comments/${commentId}`);
        return data;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};


