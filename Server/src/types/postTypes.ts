import mongoose from "mongoose";

export interface IPost extends Document {
    content: string;
    imageUrls: string[];
    createdAt: Date;
    updatedAt: Date;
    author: mongoose.Types.ObjectId;
    group?: mongoose.Types.ObjectId;
    isPublic: boolean;
    comments: mongoose.Types.ObjectId[];
    likes: mongoose.Types.ObjectId[];
    locationString: string;

}