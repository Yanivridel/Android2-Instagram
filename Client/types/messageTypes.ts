import { IUser } from "./userTypes";

export interface IMessage {
    _id?: string;
    content: string;
    senderId: IUser | string;
    recipientId: IUser | string;
    chatId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    read?: boolean;
}