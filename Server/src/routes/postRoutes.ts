import express from "express";
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostsByUser,
    getMyPosts
} from '../controllers/postController';
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post('/', authenticateToken, createPost);

router.get('/', authenticateToken, getAllPosts);

router.get('/user/:userId', authenticateToken, getPostsByUser);

router.get('/me', authenticateToken, getMyPosts);

// Get a specific post by ID
router.get('/:id', authenticateToken, getPostById);

// Update a post by ID
router.put('/:id', authenticateToken, updatePost);

// Delete a post by ID
router.delete('/:id', authenticateToken, deletePost);


export default router;
