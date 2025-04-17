import express, { Request, Response } from "express";
import {
    registerUser,
    loginUser,
} from '../controllers/userController';
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post('/register', registerUser);

router.get('/login', authenticateToken, loginUser);

export default router;
