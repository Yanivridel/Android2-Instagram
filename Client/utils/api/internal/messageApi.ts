import { IMessage } from '@/types/messageTypes';
import { api } from './apiService';

export const getMessageByChatId = async ({ chatId }: { chatId: string}): Promise<IMessage[] | null> => {
    try {
        const { data } = await api.get<IMessage[]>(`api/messages/${chatId}`);
        return data;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};

export const getMessageByUserId = async ({ userId }: { userId: string}): Promise<IMessage[] | null> => {
    try {
        const { data } = await api.get<IMessage[]>(`api/messages/between/${userId}`);
        return data;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};

interface createMessageReq {
    content: string, 
    recipientId: string
}

export const createMessage = async ({ content, recipientId }: createMessageReq): Promise<IMessage | null> => {
    try {
        const { data } = await api.post<IMessage>(`api/messages/`, { content, recipientId });
        return data;
    } catch (error: any) {
        console.error("Create chat error:", error?.response?.data || error.message);
        return null;
    }
};