import mongoose from "mongoose";

export interface IPost extends Document {
    content: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    author: mongoose.Types.ObjectId;
    group?: mongoose.Types.ObjectId;
    isPublic: boolean;
}