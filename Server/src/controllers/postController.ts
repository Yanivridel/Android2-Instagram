import { Request, Response } from 'express';
import { userModel } from '../models/userModel';
import { postModel } from 'models/postModel';
import { MongoError } from 'mongodb';
import { AuthenticatedRequest } from 'types/expressTypes';

export const createPost = async(req: AuthenticatedRequest, res: Response) => {
    try {
        const { content, imageUrl, group, isPublic } = req.body;

        if (!content) {
            res.status(400).json({ message: "Content is required" });
            return;
        }

        const newPost = new postModel({
            content,
            imageUrl,
            group,
            isPublic,
            author: req.userDb?._id,
        });

        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ status: "error", message: "Failed to create post" });
    }
};