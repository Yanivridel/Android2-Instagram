import { Schema, model } from 'mongoose';
import { IUser } from 'types/userTypes';

const UserSchema = new Schema<IUser>({
    firebaseUid: { type: String, required: true, unique: true },
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    ratingStats: {
        averageScore: { type: Number, default: 2.5, min: 0, max: 5 },
        totalRatings: { type: Number, default: 0 }
    },
    posts: { type: [Schema.Types.ObjectId], ref: 'Post', default: [] },
    taggedPosts: { type: [Schema.Types.ObjectId], ref: 'Post', default: [] },
    likedPosts: { type: [Schema.Types.ObjectId], ref: 'Post', default: [] },
    likedComments: { type: [Schema.Types.ObjectId], ref: 'Comment', default: [] },
    bio: { type: String, default: "I'm a new user!" },
    gender: { type: String, default: "he/him" },
    profileImage: { type: String, default: '' },
    followers: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
    following: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
    groups: { type: [Schema.Types.ObjectId], ref: 'Group', default: [] },
    notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification', default: [] }],
}, {
    timestamps: true
});

export const userModel = model<IUser>('User', UserSchema);
