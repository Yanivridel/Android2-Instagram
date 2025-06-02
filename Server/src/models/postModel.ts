import mongoose, { Schema, model } from 'mongoose';
import { IPost } from 'types/postTypes';

const postSchema = new mongoose.Schema<IPost>({
    content: {
        type: String,
        required: true,
    },
    imageUrls: [{ type: String, default: [] }],
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
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comment',
        default: [],
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    locationString: { type: String, default: '' },

});

export const postModel = model<IPost>('Post', postSchema);
