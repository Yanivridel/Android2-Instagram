import { Router } from 'express';
import {
    createGroup,
    getGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
    getPostsByGroupId,
    joinGroup,
    leaveGroup,
    getMyGroups
} from '../controllers/groupController';
import { authenticateToken } from 'middleware/auth.middleware';

const router = Router();

router.post('/', createGroup);
router.get('/', getGroups);
router.get('/me', authenticateToken, getMyGroups);
router.get('/posts/:groupId', getPostsByGroupId);
router.post('/join/:groupId', authenticateToken, joinGroup);
router.post('/leave/:groupId', authenticateToken, leaveGroup);
router.get('/:id', getGroupById);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);

export default router;