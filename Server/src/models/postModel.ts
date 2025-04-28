import mongoose, { Schema, model } from 'mongoose';
import { IPost } from 'types/postTypes';

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
        imageUrl: String,
        createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    },
    isPublic: {
        type: Boolean,
        default: true,
    }
});

export const postModel = model<IPost>('Post', postSchema);
