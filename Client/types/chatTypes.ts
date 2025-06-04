import { IUser } from "./userTypes";

export interface IChat {
    _id: string;
    participants: IUser[];
    createdAt: Date;
    updatedAt: Date;
};