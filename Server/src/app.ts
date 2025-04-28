import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
// Google Auth imports
import session from 'express-session';
import cookieParser from "cookie-parser";

dotenv.config();


const app = express();
const PORT = Number(process.env.PORT) || 3000;


// Middleware Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://booking-clone-client-emw671yyq-yanivs-projects-d091535c.vercel.app',
    'https://booking-clone-client.vercel.app'
];

app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

// Database Connection
if (process.env.DB_URI) {
    mongoose.connect(process.env.DB_URI)
    .then(() => console.log("Successfully Connected to DB"))
    .catch((err) => console.error("Connection to DB failed", err));
} else {
    console.error("DB_URI environment variable is not defined");
}

// Server Check
app.get('/', (req: Request, res: Response): void => {
    res.status(200).send({ message: "Server is alive !" });
});

// Routes
import userRoutes from './routes/userRoutes'
import postRoutes from './routes/postRoutes'

app.use('/api/users', userRoutes);

app.use('/api/posts', postRoutes);


app.listen(PORT, '0.0.0.0', () => {
    console.log("Server running on 0.0.0.0:3000");
});