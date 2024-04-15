import express from 'express';
const app = express()


app.use(
    express.urlencoded({ extended: true })
);
app.use(express.json());

import UserRoute from './Routes/UserRoute.js';


import cors from 'cors';
app.use(cors());

import dotenv from 'dotenv';
import { connectDB } from './Middlewares/DB.js';
dotenv.config()

connectDB();

app.use('/api/users',UserRoute);



const PORT = process.env.PORT || 5872

app.listen(PORT,()=> console.log(`Server running at ${PORT}`));