import express, { Request, Response } from "express";
import {
    registerUser,
    loginUser,
    getUserByEmail,
} from '../controllers/userController';
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post('/register', registerUser);

router.get('/login', authenticateToken, loginUser);

router.get('/email/:email', getUserByEmail);

export default router;
