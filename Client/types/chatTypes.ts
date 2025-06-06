import { IMessage } from "./messageTypes";
import { IUser } from "./userTypes";

export interface IChat {
    _id: string;
    participants: IUser[];
    lastMessage?: IMessage;
    createdAt: Date;
    updatedAt: Date;
};