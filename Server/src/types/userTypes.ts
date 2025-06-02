import mongoose from "mongoose";

export interface IUser extends Document {
    _id?: mongoose.Schema.Types.ObjectId,
    firebaseUid: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    rating: number;
    gender: string;
    posts: mongoose.Schema.Types.ObjectId[];
    likedPosts: mongoose.Schema.Types.ObjectId[];
    likedComments: mongoose.Schema.Types.ObjectId[];
    bio: string;
    profileImage: string;
    followers: mongoose.Schema.Types.ObjectId[];
    following: mongoose.Schema.Types.ObjectId[];
    groups: mongoose.Schema.Types.ObjectId[];
    notifications: mongoose.Schema.Types.ObjectId[];
    taggedPosts: mongoose.Schema.Types.ObjectId[];
}