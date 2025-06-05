
export interface IMessage {
    _id?: string;
    content: string;
    senderId: string;
    recipientId: string; // user or group chat id
    chatId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    read?: boolean;
}