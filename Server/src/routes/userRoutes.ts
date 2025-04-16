import express, { Request, Response } from "express";
import {
    registerUser,
    loginUser,
} from '../controllers/userController';
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post('/login', authenticateToken, loginUser);

router.post('/register', registerUser);

export default router;
