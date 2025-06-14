import { Request, Response } from 'express';
import { userModel } from '../models/userModel';
import { MongoError } from 'mongodb';
import { AuthenticatedRequest } from 'types/expressTypes';

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
            role: 'user',
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

export const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.params;
        const user = await userModel.findOne({ email });
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: "Failed to get user by email" });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const user = await userModel.findById(userId)
            .populate('posts likedPosts followers following');

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Failed to fetch user' });
    }
};

export const getAutocompletePrefix = async (req: Request, res: Response) => {
    try {
        const { prefix } = req.params;

        if (!prefix || typeof prefix !== 'string') {
            res.status(400).json({ message: 'Query string is required' });
            return;
        }

        const users = await userModel.find({
            username: { $regex: prefix, $options: 'i' }
        })
        .limit(5)
        .select('username profileImage ratingStats');

        res.status(200).json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ message: 'Failed to search users' });
    }
};

export const updateUserBio = async (req: AuthenticatedRequest, res: Response) => {
    const { bio } = req.body;
    const userId = req.userDb?._id;

    if (!bio) {
        res.status(400).json({ message: "Bio is required." });
        return;
    }

    try {
        const user = await userModel.findByIdAndUpdate(
            userId,
            { bio },
            { new: true, runValidators: true }
        );

        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        res.status(200).json({ message: "Bio updated successfully.", user });
    } catch (error) {
        console.error("Error updating bio:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};