import express from 'express';
import { createMessage, getMessagesBetweenUsers } from '../controllers/messageController';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticateToken, createMessage);

router.get('/between/:otherUserId', authenticateToken, getMessagesBetweenUsers);

export default router;
