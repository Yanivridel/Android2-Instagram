import { messageModel } from 'models/messageModel';
import { chatModel } from 'models/chatModel';
import { Server, Socket } from 'socket.io';

interface MessagePayload {
    chatId: string;
    message: {
        id: string;
        senderId: string;
        content: string;
        timestamp: string;
    };
}

export default function registerSocketHandlers(socket: Socket, io: Server) {
    socket.on('join', async (chatId: string) => {
        socket.join(chatId);
        console.log(`✅ ${socket.id} joined chat ${chatId}`);

        try {
            const messages = await messageModel.find({ chatId }).sort({ createdAt: 1 });
            socket.emit('chat-history', messages);
        } catch (err) {
            console.error("❌ Failed to load messages", err);
        }
    });

    socket.on('leave', (chatId: string) => {
        socket.leave(chatId);
        console.log(`🚪 ${socket.id} left chat ${chatId}`);
    });

    socket.on('send-message', async ({ chatId, message }: MessagePayload) => {
        try {
            // Fetch chat participants
            const chat = await chatModel.findById(chatId);
            if (!chat) {
                console.error("❌ Chat not found");
                return;
            }

            const senderId = message.senderId;
            const recipientId = chat.participants.find((p) => p.toString() !== senderId);

            if (!recipientId) {
                console.error("❌ Could not determine recipientId");
                return;
            }

            const newMessage = await messageModel.create({
                content: message.content,
                senderId,
                recipientId,
                chatId,
            });

            io.to(chatId).emit('message', {
                _id: newMessage._id,
                content: newMessage.content,
                senderId,
                recipientId,
                chatId,
                createdAt: newMessage.createdAt,
            });

            console.log(`📨 Message stored and sent to chat ${chatId}`);
        } catch (err) {
            console.error("❌ Failed to send message", err);
        }
    });

    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
}
