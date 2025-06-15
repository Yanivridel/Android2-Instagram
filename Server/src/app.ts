import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import registerSocketHandlers from './socket';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Replace with frontend URL in production
        methods: ['GET', 'POST']
    }
});
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.options('*', cors());

app.use(express.json());

// Database Connection
if (process.env.DB_URI) {
    mongoose.connect(process.env.DB_URI)
    .then(() => console.log("Successfully Connected to DB"))
    .catch((err) => console.error("Connection to DB failed", err));
} else {
    console.error("DB_URI environment variable is not defined");
}

// Server Check
app.get('/', (req: Request, res: Response): void => {
    res.status(200).send({ message: "Server is alive !" });
});

// Routes
import userRoutes from './routes/userRoutes'
import postRoutes from './routes/postRoutes'
import messageRoutes from './routes/messageRoutes';
import chatRoutes from 'routes/chatRoutes';
import commentRoutes from 'routes/commentRoutes';
import ratingRoutes from 'routes/ratingRoutes';
import groupRoutes from 'routes/groupRoutes';

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/groups', groupRoutes);


// Socket.io
io.on('connection', (socket) => {
    console.log(`📡 User connected: ${socket.id}`);
    registerSocketHandlers(socket, io);
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on 0.0.0.0:${PORT}`);
});