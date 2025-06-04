// types/messageTypes.ts
import { Types } from 'mongoose';

export interface IMessage {
    _id?: Types.ObjectId;
    content: string;
    senderId: Types.ObjectId;
    recipientId: Types.ObjectId; // user or group chat id
    chatId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    read?: boolean;
}
