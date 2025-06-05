import express from "express";
import {
    createPost,
    getPostById,
    updatePost,
    deletePost,
    getPostsByUser,
    getMyPosts
} from '../controllers/postController';
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post('/', authenticateToken, createPost);

router.get('/user/:userId', authenticateToken, getPostsByUser);

router.get('/me', authenticateToken, getMyPosts);

// Get a specific post by ID
router.get('/:postId', authenticateToken, getPostById);

// Update a post by ID
router.put('/:postId', authenticateToken, updatePost);

// Delete a post by ID
router.delete('/:postId', authenticateToken, deletePost);


export default router;
