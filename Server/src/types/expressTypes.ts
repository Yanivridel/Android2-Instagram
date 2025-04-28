import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user?: any;
    userDb?: IUser;
}

export interface AuthenticatedRequestOptional extends Request {
    userId?: string;
}

import { DecodedIdToken } from "firebase-admin/auth";
import { IUser } from "./userTypes";

// Extend the express Request type
declare global {
    namespace Express {
        interface Request {
        user?: DecodedIdToken;
        }
    }
}