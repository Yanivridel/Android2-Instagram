import { IUser } from "./userTypes";

export interface IComment {
    _id: string;
    content: string;
    post: string;
    author: Partial<IUser>;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    likes: string[];
    replies?: string[];
}