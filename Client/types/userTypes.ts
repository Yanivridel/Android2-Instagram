
export interface IUser {
    _id: string;
    firebaseUid: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    rating: number;
    bio: string;
    gender: string;
    profileImage: string;
    posts: string[];
    likedPosts: string[];
    likedComments: string[];
    followers: string[];
    following: string[];
    groups: string[];
    taggedPosts: string[];
    notifications: string[];
    createdAt: string; // ISO date string
    updatedAt: string;
    __v: number;
}
