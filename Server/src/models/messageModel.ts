// models/messageModel.ts
import mongoose, { Schema, model } from 'mongoose';
import { IMessage } from 'types/messageTypes';

const messageSchema = new Schema<IMessage>({
    content: { type: String, required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    read: { type: Boolean, default: false },
}, { timestamps: true });

export const messageModel = model<IMessage>('Message', messageSchema);
