import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, AuthenticatedRequestOptional } from '../types/expressTypes';
import admin from 'firebase-admin';

import { firebaseAdmin } from '../firebase/firebaseAdmin';
import { userModel } from 'models/userModel';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token provided" });
        return;
    }

    const idToken = authHeader.split("Bearer ")[1];
    console.log("idToken", idToken)

    try {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);

        const user = await userModel.findOne({ firebaseUid: decodedToken.uid });
        console.log("user", user)
        if (!user) {
            res.status(401).json({ message: "User not found in DB" });
            return;
        }

        (req as AuthenticatedRequest).user = decodedToken;
        (req as AuthenticatedRequest).userDb = user;

        next();
    } catch (error) {
        console.error("Error trying to auth token " + error);
        res.status(401).json({ message: "Invalid token", error });
    }
};