import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './mongo.js';
import helmet from 'helmet'
import authRoutes from '../routes/authRoutes.js'
import postRoutes from '../routes/postRoutes.js'
import commentRoutes from '../routes/commentRoutes.js'



dotenv.config();

export const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());

app.get('/', (req, res) => {
    res.send('Welcome to Comment Manager');
});

app.use(authRoutes)
app.use(postRoutes)
app.use(commentRoutes)

export default app;