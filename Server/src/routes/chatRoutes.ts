import express from 'express';
import { 
    getUserChats, 
    getOrCreateChatWithUser
} from '../controllers/chatController';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// All chat routes require auth
router.use(authenticateToken);

// Get all chats for logged-in user
router.get('/', getUserChats);

// Get or create chat with specific user
router.get('/:otherUserId', getOrCreateChatWithUser);

export default router;
