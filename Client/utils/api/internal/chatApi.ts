// chatApi.ts
import { api } from './apiService';
import { IChat } from '@/types/chatTypes';

interface CreateChatReq {
    userId1: string;
    userId2: string;
}

interface CreateChatRes {
    chat: IChat;
}

export const createChat = async ({ userId1, userId2 }: CreateChatReq): Promise<IChat | null> => {
    try {
        const { data } = await api.post<CreateChatRes>('api/chats', { userId1, userId2 });
        return data.chat;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};

interface GetUserChatsRes {
    chats: IChat[];
}

export const getUserChats = async (userId: string): Promise<IChat[]> => {
    try {
        const { data } = await api.get<GetUserChatsRes>(`api/chats/user/${userId}`);
        return data.chats;
    } catch (error: any) {
        console.error("Get user chats error:", error?.response?.data || error.message);
        return [];
    }
};

export const getChatByUsers = async (userId1: string, userId2: string): Promise<IChat | null> => {
    try {
        const { data } = await api.get<{ chat: IChat }>(`api/chats/between/${userId1}/${userId2}`);
        return data.chat;
    } catch (error: any) {
        console.error("Get chat between users error:", error?.response?.data || error.message);
        return null;
    }
};
