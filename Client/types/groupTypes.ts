import { IUser } from "./userTypes";

export interface IGroup {
    _id?: string;
    name: string;
    groupPicture: string;
    description?: string;
    members: IUser[];
    managers: IUser[];
    ratingLimit: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}