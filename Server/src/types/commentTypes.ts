import { Types } from 'mongoose';

export interface IComment {
    _id?: Types.ObjectId;
    content: string;
    post: Types.ObjectId;
    author: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    likes?: Types.ObjectId[];
}
