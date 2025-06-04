import { IUser } from "./userTypes";

export interface IPost {
    _id: string;
    content: string;
    imageUrls: string[];
    createdAt: string; // ISO date string
    updatedAt: string;
    author: IUser;
    group?: string; // Group ID
    isPublic: boolean;
    rating: number;
    comments: IComment;
    likes: number;    
    locationString: string;
}


// CHANGE LATER TO IUser
export interface IComment {
    _id?: string;
    content: string;
    post: string; // Post ID
    author: IUser;
    createdAt?: Date;
    updatedAt?: Date;
    likes: number;
}