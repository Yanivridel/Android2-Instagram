import { Types } from "mongoose";

export interface IGroup extends Document {
    _id?: Types.ObjectId;
    name: string;
    groupPicture: string;
    description?: string;
    members: Types.ObjectId[];
    managers: Types.ObjectId[];
    ratingLimit: number;
    createdAt?: Date;
    updatedAt?: Date;
}