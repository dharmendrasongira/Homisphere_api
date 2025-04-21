import express from "express";
import {
  addMessage
} from "../controllers/message.controller.js";
import { verifytoken } from '../middleware/verifyToken.js';

const router = express.Router();


router.post("/:chatId", verifytoken, addMessage);

export default router;