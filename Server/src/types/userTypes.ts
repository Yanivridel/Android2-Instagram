import mongoose from "mongoose";

export interface IUser extends Document {
    _id?: mongoose.Schema.Types.ObjectId,
    firebaseUid: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
}