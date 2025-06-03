import { Request, Response } from 'express';
import { messageModel } from '../models/messageModel';
import { AuthenticatedRequest } from 'types/expressTypes';

export const createMessage = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { content, recipient } = req.body;

        if (!content || !recipient) {
            res.status(400).json({ message: "Content and recipient are required" });
            return;
        }

        const newMessage = new messageModel({
        content,
        sender: req.userDb?._id,
        recipient,
        });

        await newMessage.save();

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Failed to create message' });
    }
};

// Get all messages between two users (or with recipient)
export const getMessagesBetweenUsers = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userDb?._id;
        const { otherUserId } = req.params;

        if (!userId || !otherUserId) {
            res.status(400).json({ message: "User IDs are required" });
            return;
        }

        // Find messages where sender is either userId or otherUserId and recipient is the other one (two-way chat)
        const messages = await messageModel.find({
        $or: [
            { sender: userId, recipient: otherUserId },
            { sender: otherUserId, recipient: userId },
        ],
        }).sort({ createdAt: 1 }); // chronological order

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
};
