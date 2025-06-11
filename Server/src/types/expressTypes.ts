import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user?: any;
    userDb?: Document<unknown, {}, IUser> & IUser & Required<{ _id: Schema.Types.ObjectId }> & { __v: number };
}

export interface AuthenticatedRequestOptional extends Request {
    userId?: string;
}

import { DecodedIdToken } from "firebase-admin/auth";
import { IUser } from "./userTypes";
import { Document, Schema } from "mongoose";

// Extend the express Request type
declare global {
    namespace Express {
        interface Request {
        user?: DecodedIdToken;
        }
    }
}