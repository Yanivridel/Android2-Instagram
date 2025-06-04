import { Request, Response } from 'express';
import { chatModel } from '../models/chatModel';
import { AuthenticatedRequest } from 'types/expressTypes';
import { messageModel } from 'models/messageModel';

// Get all chats for logged-in user
export const getUserChats = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userDb?._id?.toString();
        if (!userId) {
            res.status(400).json({ message: "User ID required" });
            return;
        }

        // Fetch all chats the user is part of
        const chats = await chatModel.find({ participants: userId })
            .sort({ updatedAt: -1 })
            .populate({
                path: 'participants',
                match: { _id: { $ne: userId } }, // Only populate the OTHER user
                select: '_id username profileImage', // Optional: choose what fields to send
            })
            .lean(); // Convert to plain JS object

        // For each chat, find the latest message
        const enrichedChats = await Promise.all(chats.map(async (chat) => {
            const lastMessage = await messageModel.findOne({ chatId: chat._id })
                .sort({ createdAt: -1 })
                .lean();

            return {
                ...chat,
                lastMessage: lastMessage || null,
            };
        }));

        res.status(200).json(enrichedChats);
    } catch (error) {
        console.error('Error fetching user chats:', error);
        res.status(500).json({ message: 'Failed to fetch chats' });
    }
};

// Get or create chat between logged-in user and other user
export const getOrCreateChatWithUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userDb?._id?.toString();
        const { otherUserId } = req.params;

        if (!userId || !otherUserId) {
            res.status(400).json({ message: "User IDs required" });
            return;
        }

        const [id1, id2] = [userId, otherUserId].sort();

        let chat = await chatModel.findOne({
            participants: { $all: [id1, id2], $size: 2 },
        });

        if (!chat) {
            chat = await chatModel.create({ participants: [id1, id2] });
        }

        res.status(200).json(chat);
    } catch (error) {
        console.error('Error getting or creating chat:', error);
        res.status(500).json({ message: 'Failed to get or create chat' });
    }
};
