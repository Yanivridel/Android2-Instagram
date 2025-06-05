import express, { Request, Response } from "express";
import {
    registerUser,
    loginUser,
    getUserByEmail,
    getUserById,
} from '../controllers/userController';
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post('/register', registerUser);

router.get('/login', authenticateToken, loginUser);

router.get('/email/:email', getUserByEmail);

router.get('/:userId', getUserById);


export default router;
