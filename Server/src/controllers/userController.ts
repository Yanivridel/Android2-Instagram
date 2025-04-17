import { Request, Response } from 'express';
import { userModel } from '../models/userModel';
import { MongoError } from 'mongodb';

interface IRegisterUser {
    firebaseUid: string;
    email: string;
    username: string;
}
export const registerUser = async (req: Request<{}, {}, IRegisterUser>, res: Response): Promise<void> => {
    try {
        const { firebaseUid, email, username } = req.body;

        if (!firebaseUid || !email || !username) {
            res.status(400).send({ status: "error", message: "Missing required parameters" });
            return;
        }

        const existingUser = await userModel.findOne({ firebaseUid });
        if (existingUser) {
            res.status(409).send({ status: "error", message: "User already exists", data: existingUser });
            return;
        }

        const newUser = new userModel({
            firebaseUid,
            email,
            username,
            role: 'user'
        });

        await newUser.save();

        res.status(201).send({
            status: "success",
            message: "User registered successfully",
            data: newUser
        });
    } catch (error: unknown) {
        console.log(error);
        if (error instanceof MongoError && error.code === 11000) {
            res.status(409).json({
                status: "error",
                message: "Email or UID already exists",
            });
        } else {
            res.status(500).json({
                status: "error",
                message: "Unexpected error",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { uid } = req.user!;

        // Find the user based on the Firebase UID
        const existingUser = await userModel.findOne({ firebaseUid: uid });

        if (!existingUser) {
            res.status(404).json({ 
                status: "error",
                message: "User not found in database" 
            });
            return;
        }

        res.status(200).json({
            message: "Login successful",
            user: existingUser,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Unexpected error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};