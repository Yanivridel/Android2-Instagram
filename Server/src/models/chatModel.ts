import mongoose, { Schema, model } from 'mongoose';
import { IChat } from 'types/chatTypes';

const chatSchema = new Schema<IChat>({
    participants: [
        { type: Schema.Types.ObjectId, ref: 'User', required: true }
    ],
}, { 
    timestamps: true 
});

// Prevent duplicate chats (between same 2 users in any order)
chatSchema.index({ participants: 1 }, { unique: false });

export const chatModel = model('Chat', chatSchema);
