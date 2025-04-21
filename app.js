import express from 'express';
import cors from 'cors';
import authRoute from './routes/auth.route.js';
import postRoute from './routes/post.route.js';
import userRoute from './routes/user.route.js';
import testRoute from './routes/test.route.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Routes

app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);
app.use('/api/users', userRoute);
app.use('/api/test', testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.listen(port, () => console.log(`Server running on port ${port}`));
