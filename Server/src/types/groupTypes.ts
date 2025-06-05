import { Types } from "mongoose";

export interface IGroup extends Document {
    _id?: Types.ObjectId;
    name: string;
    description?: string;
    members: Types.ObjectId[];
    managers: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}