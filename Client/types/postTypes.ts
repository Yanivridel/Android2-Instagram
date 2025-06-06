import { IComment } from "./commentTypes";
import { IUser } from "./userTypes";

export interface IPost {
    _id: string;
    content: string;
    imageUrls: string[];
    createdAt: string; // ISO date string
    updatedAt: string;
    author: Partial<IUser>;
    group?: string; // Group ID
    isPublic: boolean;
    comments: IComment;
    likes: number;    
    locationString: string;
}