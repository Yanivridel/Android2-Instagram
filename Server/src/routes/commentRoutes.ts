import express from 'express';
import { 
    createComment, 
    deleteComment, 
    getCommentById, 
    updateComment,
    getCommentsByPost
} from 'controllers/commentController';
import { authenticateToken } from 'middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticateToken, createComment);

router.get('/:id', getCommentById);

router.put('/:id', authenticateToken, updateComment);

router.delete('/:id', authenticateToken, deleteComment);

router.get('/post/:postId', getCommentsByPost);

export default router;
