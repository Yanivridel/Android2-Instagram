// models/messageModel.ts
import mongoose, { Schema, model } from 'mongoose';
import { IMessage } from 'types/messageTypes';

const messageSchema = new Schema<IMessage>({
    content: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    read: { type: Boolean, default: false },
}, { timestamps: true });

export const messageModel = model<IMessage>('Message', messageSchema);
