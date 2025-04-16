import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    userId: string;
}

export interface AuthenticatedRequestOptional extends Request {
    userId?: string;
}

import { DecodedIdToken } from "firebase-admin/auth";

// Extend the express Request type
declare global {
    namespace Express {
        interface Request {
        user?: DecodedIdToken;
        }
    }
}