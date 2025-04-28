import express from "express";
import {
    createPost,
    // getPosts,
    // getPostById,
    // updatePost,
    // deletePost
} from '../controllers/postController';
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post('/', authenticateToken, createPost);

// router.get('/', authenticateToken, getPosts);

// router.get('/:id', authenticateToken, getPostById);

// router.put('/:id', authenticateToken, updatePost);

// router.delete('/:id', authenticateToken, deletePost);

export default router;
