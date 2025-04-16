import mongoose, { Schema, model } from 'mongoose';
import { IUser } from 'types/userTypes';

const UserSchema = new Schema<IUser>({
    firebaseUid: { type: String, required: true, unique: true },
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, {
    timestamps: true
});

export const userModel = model<IUser>('User', UserSchema);
