import mongoose from "mongoose";

export interface IChat {
    _id: mongoose.Types.ObjectId;
    participants: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
};