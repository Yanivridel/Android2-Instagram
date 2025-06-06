// chatApi.ts
import { api } from './apiService';
import { IChat } from '@/types/chatTypes';

interface CreateChatReq {
    anotherUser: string;
}

export const createGetChat = async ({ anotherUser }: CreateChatReq): Promise<IChat | null> => {
    try {
        const { data } = await api.get<IChat>(`api/chats/${anotherUser}`);
        return data;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};

export const getAllChats = async (): Promise<IChat[]> => {
    try {
        const { data } = await api.get<IChat[]>(`api/chats`);
        return data;
    } catch (error: any) {
        console.error("Get user chats error:", error?.response?.data || error.message);
        return [];
    }
};

