import express from 'express';
import { 
    createMessage, 
    getMessagesByChatId,
    getMessagesByUserId
} from '../controllers/messageController';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticateToken, createMessage);

router.get('/:chatId', authenticateToken, getMessagesByChatId);

router.get('/between/:otherUserId', authenticateToken, getMessagesByUserId);

export default router;
