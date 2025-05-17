import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {errorMiddleware} from './src/middlewares/errorMiddleware.js';
import storeRoutes from './src/routes/storeRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true                
}));
connectDB();
app.use(cookieParser());

app.use('/auth',authRoutes)
app.use('/store',storeRoutes)
app.use("/order",orderRoutes)
app.use('/user',userRoutes)
app.use('/admin',adminRoutes)
app.use(errorMiddleware)
app.use("/uploads", express.static("uploads"));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});