import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequestOptional } from '../types/expressTypes';
import admin from 'firebase-admin';

import { firebaseAdmin } from '../firebase/firebaseAdmin';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token provided" });
        return;
    }

    const idToken = authHeader.split("Bearer ")[1];

    try {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token", error });
        return;
    }
};