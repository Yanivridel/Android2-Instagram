// types/messageTypes.ts
import { Types } from 'mongoose';

export interface IMessage {
    _id?: Types.ObjectId;
    content: string;
    sender: Types.ObjectId;
    recipient: Types.ObjectId; // user or group chat id
    createdAt?: Date;
    updatedAt?: Date;
    read?: boolean;
}
