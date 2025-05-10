import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.options('*', cors());

app.use(express.json());

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