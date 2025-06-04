import { Request, Response } from 'express';
import { messageModel } from '../models/messageModel';
import { chatModel } from '../models/chatModel';
import { AuthenticatedRequest } from 'types/expressTypes';
import mongoose from 'mongoose';

// Helper to get or create chat
async function getOrCreateChat(userId1: string, userId2: string) {
    const [id1, id2] = [userId1, userId2].sort();
    let chat = await chatModel.findOne({
        participants: { $all: [id1, id2], $size: 2 },
    });
    if (!chat) {
        chat = await chatModel.create({ participants: [id1, id2] });
    }
    return chat;
}

export const createMessage = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { content, recipientId } = req.body;
        const senderId = req.userDb?._id?.toString();

        if (!content || !recipientId || !senderId) {
            res.status(400).json({ message: "Content, recipient, and sender are required" });
            return;
        }

        // Get or create chat between sender and recipient
        const chat = await getOrCreateChat(senderId, recipientId);

        const newMessage = new messageModel({
            content,
            senderId,
            recipientId,
            chatId: chat._id,
        });

        await newMessage.save();

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Failed to create message' });
    }
};

// Get messages by chatId (better than between users)
export const getMessagesByChatId = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { chatId } = req.params;
        const userId = req.userDb?._id;

        if (!chatId || !userId) {
            res.status(400).json({ message: "chatId and userId required" });
            return;
        }

        // Ensure chatId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(chatId)) {
            res.status(400).json({ message: "Invalid chatId format" });
            return;
        }

        // Check if user is a participant in the chat
        const chat = await chatModel.findById(chatId);
        if (!chat) {
            res.status(404).json({ message: "Chat not found" });
            return;
        }

        if (!chat.participants.some(p => p.toString() === userId.toString())) {
            res.status(403).json({ message: "Access denied" });
            return;
        }

        const messages = await messageModel.find({ chatId }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error('❌ Error fetching messages by chatId:', error);
        res.status(500).json({ message: 'Failed to fetch messages' });
        return;
    }
};

export const getMessagesByUserId = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.userDb?._id;
        const { otherUserId } = req.params;

        if (!userId || !otherUserId) {
            res.status(400).json({ message: "userId and otherUserId are required" });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
            res.status(400).json({ message: "Invalid otherUserId format" });
            return;
        }

        const messages = await messageModel.find({
            $or: [
                { senderId: userId, recipientId: otherUserId },
                { senderId: otherUserId, recipientId: userId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error('❌ Error fetching messages by userId:', error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
};